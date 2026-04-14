import type { ExtraGroup, ExtraMember } from '../config/extraData';

export interface ExtraGroupSummary {
  id: string;
  code: string;
  color: string;
  zhTitle: string;
  enTitle: string;
  zhTagline: string;
  enTagline: string;
  members: ExtraMember[];
  activeMembers: ExtraMember[];
  reservedMembers: ExtraMember[];
  countries: string[];
  countryCodes: string[];
  cities: string[];
  activeCount: number;
  reservedCount: number;
  frameCount: number;
  messageCount: number;
  featuredMemberId: string;
}

export interface ExtraWorkbenchMarker {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  groupId: string;
  groupCode: string;
  color: string;
  memberIds: string[];
  memberCount: number;
  frameCount: number;
  messageCount: number;
  zhTitle: string;
  enTitle: string;
  zhTagline: string;
  enTagline: string;
  members: ExtraMember[];
  featuredMemberId: string;
  activeMembers: ExtraMember[];
}

export interface ExtraWorkbenchCountryNode {
  id: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  cityCount: number;
  memberCount: number;
  frameCount: number;
  messageCount: number;
  groupIds: string[];
  groupCodes: string[];
  groups: ExtraGroupSummary[];
  markers: ExtraWorkbenchMarker[];
  cities: string[];
  activeMembers: ExtraMember[];
}

export const getActiveMembers = (group: ExtraGroup) =>
  group.members.filter((member) => !member.isPlaceholder);

export const getReservedMembers = (group: ExtraGroup) =>
  group.members.filter((member) => member.isPlaceholder);

export const getGroupCountries = (group: ExtraGroup) =>
  getActiveMembers(group).map((member) => member.country);

export const getGroupCities = (group: ExtraGroup) =>
  getActiveMembers(group).map((member) => member.city);

export const getGroupCountryCodes = (group: ExtraGroup) =>
  getActiveMembers(group).map((member) => member.countryCode);

export const buildExtraGroupSummaries = (groups: ExtraGroup[]): ExtraGroupSummary[] =>
  groups.map((group) => {
    const activeMembers = getActiveMembers(group);
    const reservedMembers = getReservedMembers(group);
    const featuredMember = activeMembers[0] ?? group.members[0];

    return {
      id: group.id,
      code: group.code,
      color: group.color,
      zhTitle: group.zhTitle,
      enTitle: group.enTitle,
      zhTagline: group.zhTagline,
      enTagline: group.enTagline,
      members: group.members,
      activeMembers,
      reservedMembers,
      countries: getGroupCountries(group),
      countryCodes: getGroupCountryCodes(group),
      cities: getGroupCities(group),
      activeCount: activeMembers.length,
      reservedCount: reservedMembers.length,
      frameCount: activeMembers.reduce((sum, member) => sum + member.photos.length, 0),
      messageCount: activeMembers.reduce((sum, member) => sum + member.messageBook.length, 0),
      featuredMemberId: featuredMember?.id ?? ''
    };
  });

export const splitFeaturedAndArchive = (
  groups: ExtraGroup[],
  featuredCount = 3
): { featured: ExtraGroupSummary[]; archive: ExtraGroupSummary[] } => {
  const summaries = buildExtraGroupSummaries(groups);
  return {
    featured: summaries.slice(0, featuredCount),
    archive: summaries
  };
};

export const buildExtraWorkbenchMarkers = (groups: ExtraGroup[]): ExtraWorkbenchMarker[] => {
  return groups.flatMap((group) => {
    const activeMembers = getActiveMembers(group);
    const markerSources = activeMembers.length > 0 ? activeMembers : group.members.slice(0, 1);
    const featuredMember = activeMembers[0] ?? group.members[0];

    return markerSources.map((member) => ({
      id: `${group.id}:${member.id}`,
      city: member.city,
      country: member.country,
      countryCode: member.countryCode,
      lat: member.lat,
      lng: member.lng,
      groupId: group.id,
      groupCode: group.code,
      color: group.color,
      memberIds: activeMembers.map((item) => item.id),
      memberCount: activeMembers.length,
      frameCount: activeMembers.reduce((sum, item) => sum + item.photos.length, 0),
      messageCount: activeMembers.reduce((sum, item) => sum + item.messageBook.length, 0),
      zhTitle: group.zhTitle,
      enTitle: group.enTitle,
      zhTagline: group.zhTagline,
      enTagline: group.enTagline,
      members: group.members,
      featuredMemberId: featuredMember?.id ?? '',
      activeMembers
    }));
  });
};

export const buildExtraWorkbenchCountryNodes = (
  groups: ExtraGroup[]
): ExtraWorkbenchCountryNode[] => {
  const markers = buildExtraWorkbenchMarkers(groups);
  const summariesById = new Map(buildExtraGroupSummaries(groups).map((group) => [group.id, group]));
  const nodesByCode = new Map<string, ExtraWorkbenchCountryNode>();

  markers.forEach((marker) => {
    const existing = nodesByCode.get(marker.countryCode);
    const groupSummary = summariesById.get(marker.groupId);
    const activeMembers = marker.activeMembers.filter(
      (member) => member.countryCode === marker.countryCode
    );

    if (!existing) {
      nodesByCode.set(marker.countryCode, {
        id: marker.countryCode,
        country: marker.country,
        countryCode: marker.countryCode,
        lat: marker.lat,
        lng: marker.lng,
        cityCount: marker.city ? 1 : 0,
        memberCount: activeMembers.length,
        frameCount: activeMembers.reduce((sum, member) => sum + member.photos.length, 0),
        messageCount: activeMembers.reduce((sum, member) => sum + member.messageBook.length, 0),
        groupIds: [marker.groupId],
        groupCodes: [marker.groupCode],
        groups: groupSummary ? [groupSummary] : [],
        markers: [marker],
        cities: marker.city ? [marker.city] : [],
        activeMembers
      });
      return;
    }

    existing.lat = (existing.lat * existing.markers.length + marker.lat) / (existing.markers.length + 1);
    existing.lng = (existing.lng * existing.markers.length + marker.lng) / (existing.markers.length + 1);
    existing.markers.push(marker);
    existing.memberCount += activeMembers.length;
    existing.frameCount += activeMembers.reduce((sum, member) => sum + member.photos.length, 0);
    existing.messageCount += activeMembers.reduce((sum, member) => sum + member.messageBook.length, 0);
    existing.activeMembers.push(...activeMembers);

    if (marker.city && !existing.cities.includes(marker.city)) {
      existing.cities.push(marker.city);
      existing.cityCount += 1;
    }

    if (!existing.groupIds.includes(marker.groupId)) {
      existing.groupIds.push(marker.groupId);
      existing.groupCodes.push(marker.groupCode);
      if (groupSummary) existing.groups.push(groupSummary);
    }
  });

  return Array.from(nodesByCode.values());
};

export const buildExtraGroupRouteItems = (groups: ExtraGroup[]) =>
  groups.map((group) => {
    const countryList = getGroupCountries(group);
    const countryCodes = getGroupCountryCodes(group);

    return {
      id: group.id,
      groupId: group.id,
      code: group.code,
      label: countryList.join(' / '),
      countries: countryList,
      countryCodes
    };
  });

export const getRandomMemberIdFromWorkbenchMarker = (marker: ExtraWorkbenchMarker): string => {
  if (marker.memberIds.length === 0) return '';
  const randomIndex = Math.floor(Math.random() * marker.memberIds.length);
  return marker.memberIds[randomIndex];
};
