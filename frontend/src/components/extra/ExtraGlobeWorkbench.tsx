import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ExtraGroup } from '../../config/extraData';
import { useTranslation } from '../../i18n/hooks';
import {
  buildExtraGroupRouteItems,
  buildExtraWorkbenchCountryNodes,
  buildExtraWorkbenchMarkers,
  getRandomMemberIdFromWorkbenchMarker,
  type ExtraWorkbenchCountryNode,
  type ExtraWorkbenchMarker
} from '../../utils/extraGlobeMarkers';
import { getExtraDisplayCountryName } from '../../utils/extraCountryNames';

export interface ExtraGlobeWorkbenchProps {
  groups: ExtraGroup[];
}

const GLOBE_RADIUS = 1.18;
const COUNTRY_SURFACE_OFFSET = 0.014;
const ACTIVE_COUNTRY_OFFSET = 0.028;
const ROUTE_HEIGHT = 0.42;
const MAX_PIXEL_RATIO = 1.5;

interface GeoJsonFeature {
  type: 'Feature';
  properties: {
    name?: string;
    'ISO3166-1-Alpha-2'?: string;
    'ISO3166-1-Alpha-3'?: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][][] | number[][][];
  };
}

interface GeoJsonData {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

const latLngToVector3 = (latDeg: number, lngDeg: number, radius: number) => {
  const phi = THREE.MathUtils.degToRad(90 - latDeg);
  const theta = THREE.MathUtils.degToRad(lngDeg + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const quaternionForLatLng = (latDeg: number, lngDeg: number) => {
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(-latDeg * 0.85),
    THREE.MathUtils.degToRad(-(lngDeg + 90)),
    0,
    'YXZ'
  );
  return new THREE.Quaternion().setFromEuler(euler);
};

const colorFromGradient = (gradient: string) => {
  if (gradient.includes('sky') || gradient.includes('cyan')) return '#38bdf8';
  if (gradient.includes('pink') || gradient.includes('rose')) return '#f472b6';
  if (gradient.includes('emerald') || gradient.includes('green')) return '#34d399';
  if (gradient.includes('amber') || gradient.includes('orange')) return '#f59e0b';
  return '#60a5fa';
};

const toLineCoordinates = (feature: GeoJsonFeature): number[][][] => {
  if (feature.geometry.type === 'Polygon') {
    return feature.geometry.coordinates as number[][][];
  }
  return (feature.geometry.coordinates as number[][][][]).flat();
};

const getFeatureCenter = (feature: GeoJsonFeature) => {
  const rings = toLineCoordinates(feature);
  let latSum = 0;
  let lngSum = 0;
  let count = 0;

  rings.forEach((ring) => {
    ring.forEach(([lng, lat]) => {
      if (typeof lat === 'number' && typeof lng === 'number') {
        latSum += lat;
        lngSum += lng;
        count += 1;
      }
    });
  });

  return {
    lat: count > 0 ? latSum / count : 0,
    lng: count > 0 ? lngSum / count : 0
  };
};

const buildArcPoints = (from: ExtraWorkbenchMarker, to: ExtraWorkbenchMarker) => {
  const start = latLngToVector3(from.lat, from.lng, GLOBE_RADIUS + 0.02);
  const end = latLngToVector3(to.lat, to.lng, GLOBE_RADIUS + 0.02);
  const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS + ROUTE_HEIGHT);
  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(64);
};

const GlobeFallback: React.FC<{
  country: ExtraWorkbenchCountryNode | undefined;
  language: string;
}> = ({ country, language }) => (
  <div className="flex h-full min-h-[360px] items-center justify-center rounded-[2rem] border border-slate-800/80 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.22),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
    <div className="text-center text-slate-300/85">
      <div className="mx-auto mb-5 h-44 w-44 rounded-full border border-slate-500/40 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.55),transparent_22%),radial-gradient(circle_at_65%_70%,rgba(34,211,238,0.45),transparent_34%),linear-gradient(180deg,rgba(30,41,59,0.95),rgba(15,23,42,1))] shadow-[0_30px_80px_rgba(2,6,23,0.75)]">
        <div className="relative h-full w-full">
          <div className="absolute inset-[10%] rounded-full border border-slate-300/20" />
          <div className="absolute inset-[24%] rounded-full border border-slate-300/15" />
          <div className="absolute inset-[38%] rounded-full border border-slate-300/10" />
        </div>
      </div>
      <p className="text-sm">
        {country
          ? `${getExtraDisplayCountryName(country.countryCode, country.country, language)} · ${country.cityCount} ${
              language === 'zh-CN' ? '座城市' : 'cities'
            }`
          : 'WebGL unavailable'}
      </p>
    </div>
  </div>
);

interface HoverLabelState {
  countryCode: string;
  country: string;
  x: number;
  y: number;
  visible: boolean;
}

const ExtraGlobeWorkbench: React.FC<ExtraGlobeWorkbenchProps> = ({ groups }) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const canvasRef = useRef<HTMLDivElement>(null);
  const focusCountryRef = useRef<((countryCode: string) => void) | null>(null);
  const selectedCountryCodeRef = useRef<string>('');
  const hoveredCountryCodeRef = useRef<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [geoData, setGeoData] = useState<GeoJsonData | null>(null);
  const [hoverLabel, setHoverLabel] = useState<HoverLabelState | null>(null);

  const markers = useMemo(() => buildExtraWorkbenchMarkers(groups), [groups]);
  const countryNodes = useMemo(() => buildExtraWorkbenchCountryNodes(groups), [groups]);
  const routeItems = useMemo(() => buildExtraGroupRouteItems(groups), [groups]);

  useEffect(() => {
    if (!selectedCountryCode && countryNodes[0]) {
      setSelectedCountryCode(countryNodes[0].countryCode);
    }
  }, [countryNodes, selectedCountryCode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const canvas = document.createElement('canvas');
    setWebglSupported(!!(canvas.getContext('webgl2') || canvas.getContext('webgl')));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    selectedCountryCodeRef.current = selectedCountryCode;
  }, [selectedCountryCode]);

  useEffect(() => {
    hoveredCountryCodeRef.current = hoveredCountryCode;
  }, [hoveredCountryCode]);

  useEffect(() => {
    let mounted = true;

    const loadGeoData = async () => {
      try {
        const response = await fetch('/geo/countries.geojson');
        if (!response.ok) return;
        const json = (await response.json()) as GeoJsonData;
        if (mounted) {
          setGeoData(json);
        }
      } catch (error) {
        console.error('Failed to load countries geojson', error);
      }
    };

    loadGeoData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!webglSupported || !canvasRef.current || markers.length === 0 || !geoData) return;

    const container = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020617');

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0.2, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.6;
    controls.maxDistance = 6;
    controls.autoRotate = false;

    const root = new THREE.Group();
    scene.add(root);

    const ambientLight = new THREE.AmbientLight('#93c5fd', 0.65);
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.35);
    keyLight.position.set(3, 2, 4);
    const rimLight = new THREE.DirectionalLight('#38bdf8', 0.8);
    rimLight.position.set(-4, -1, -3);
    scene.add(ambientLight, keyLight, rimLight);

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64),
      new THREE.MeshPhongMaterial({
        color: '#06111f',
        emissive: '#0b2945',
        emissiveIntensity: 0.78,
        shininess: 18,
        specular: new THREE.Color('#8dd5ff')
      })
    );
    root.add(earth);

    const oceanGlow = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.008, 64, 64),
      new THREE.MeshPhongMaterial({
        color: '#0b1630',
        emissive: '#0ea5e9',
        emissiveIntensity: 0.08,
        transparent: true,
        opacity: 0.28
      })
    );
    root.add(oceanGlow);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS * 1.04, 48, 48),
      new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide
      })
    );
    root.add(atmosphere);

    const scanLines = new THREE.Group();
    for (let i = 0; i < 9; i += 1) {
      const y = -1 + i * 0.2;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(Math.sqrt(Math.max(GLOBE_RADIUS ** 2 - y ** 2, 0.18)), 0.0026, 8, 96),
        new THREE.MeshBasicMaterial({
          color: '#67e8f9',
          transparent: true,
          opacity: 0.06
        })
      );
      ring.position.y = y * 0.82;
      ring.rotation.x = Math.PI / 2;
      scanLines.add(ring);
    }
    root.add(scanLines);

    const meridianMaterial = new THREE.LineBasicMaterial({
      color: '#cbd5e1',
      transparent: true,
      opacity: 0.12
    });
    for (let i = 1; i <= 3; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(GLOBE_RADIUS * (0.4 + i * 0.18), 0.0045, 8, 96),
        new THREE.MeshBasicMaterial({
          color: '#e2e8f0',
          transparent: true,
          opacity: 0.06
        })
      );
      ring.rotation.x = Math.PI / 2;
      root.add(ring);
    }

    const latitudes = [-40, 0, 40];
    latitudes.forEach((lat) => {
      const curvePoints: any[] = [];
      for (let lng = -180; lng <= 180; lng += 10) {
        curvePoints.push(latLngToVector3(lat, lng, GLOBE_RADIUS * 1.002));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      root.add(new THREE.LineLoop(geometry, meridianMaterial));
    });

    const longitudes = [-120, -60, 0, 60, 120];
    longitudes.forEach((lng) => {
      const curvePoints: any[] = [];
      for (let lat = -85; lat <= 85; lat += 8) {
        curvePoints.push(latLngToVector3(lat, lng, GLOBE_RADIUS * 1.002));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      root.add(new THREE.Line(geometry, meridianMaterial));
    });

    const stars = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({
        color: '#e2e8f0',
        size: prefersReducedMotion ? 0.012 : 0.018,
        transparent: true,
        opacity: prefersReducedMotion ? 0.3 : 0.65
      })
    );
    const starPositions: number[] = [];
    for (let i = 0; i < 420; i += 1) {
      const radius = 18 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }
    stars.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    scene.add(stars);

    const featuresByCode = new Map<string, GeoJsonFeature>();
    geoData.features.forEach((feature) => {
      const code = feature.properties['ISO3166-1-Alpha-2'];
      if (code) featuresByCode.set(code, feature);
    });

    const globalBoundaries = new THREE.Group();
    const activeCountryBoundaries = new THREE.Group();
    const countryHitMeshes: any[] = [];
    const countryMeshByCode = new Map<
      string,
      { hit: any; glow: any; pulse: any; plate: any; boundaryMaterials: any[]; sweep: any; anchor: any }
    >();

    geoData.features.forEach((feature) => {
      const color = new THREE.Color('#7dd3fc');
      const rings = toLineCoordinates(feature);
      rings.forEach((ring) => {
        const points = ring.map(([lng, lat]) =>
          latLngToVector3(lat, lng, GLOBE_RADIUS + COUNTRY_SURFACE_OFFSET)
        );
        if (points.length < 2) return;

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        globalBoundaries.add(
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color,
              transparent: true,
              opacity: 0.16
            })
          )
        );
      });
    });
    root.add(globalBoundaries);

    countryNodes.forEach((countryNode) => {
      const feature = featuresByCode.get(countryNode.countryCode);
      const color = new THREE.Color(
        countryNode.markers[0] ? colorFromGradient(countryNode.markers[0].color) : '#38bdf8'
      );
      const focusPoint = feature ? getFeatureCenter(feature) : { lat: countryNode.lat, lng: countryNode.lng };
      const anchor = latLngToVector3(focusPoint.lat, focusPoint.lng, GLOBE_RADIUS + ACTIVE_COUNTRY_OFFSET);

      if (feature) {
        const rings = toLineCoordinates(feature);
        const boundaryMaterials: any[] = [];
        rings.forEach((ring) => {
          const points = ring.map(([lng, lat]) =>
            latLngToVector3(lat, lng, GLOBE_RADIUS + ACTIVE_COUNTRY_OFFSET)
          );
          if (points.length < 2) return;
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          activeCountryBoundaries.add(
            new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({
                color,
                transparent: true,
                opacity: 0.28
              })
            )
          );
          const latestLine = activeCountryBoundaries.children[
            activeCountryBoundaries.children.length - 1
          ] as any;
          if (latestLine?.material) {
            boundaryMaterials.push(latestLine.material);
          }
        });

        const plate = new THREE.Mesh(
          new THREE.CircleGeometry(0.19, 40),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.02,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        plate.position.copy(anchor);
        plate.lookAt(anchor.clone().multiplyScalar(2));
        root.add(plate);

        const sweep = new THREE.Mesh(
          new THREE.CircleGeometry(0.24, 48),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        sweep.position.copy(anchor);
        sweep.lookAt(anchor.clone().multiplyScalar(2));
        root.add(sweep);

        const hitMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 14, 14),
          new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.001
          })
        );
        hitMesh.position.copy(anchor);
        hitMesh.userData.countryCode = countryNode.countryCode;
        countryHitMeshes.push(hitMesh);
        root.add(hitMesh);

        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 14, 14),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        glow.position.copy(anchor);
        root.add(glow);

        const pulse = new THREE.Mesh(
          new THREE.RingGeometry(0.06, 0.15, 32),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.36,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        pulse.position.copy(anchor);
        pulse.lookAt(anchor.clone().multiplyScalar(2));
        root.add(pulse);

        countryMeshByCode.set(countryNode.countryCode, {
          hit: hitMesh,
          glow,
          pulse,
          plate,
          boundaryMaterials,
          sweep,
          anchor: anchor.clone()
        });
        return;
      }
    });
    root.add(activeCountryBoundaries);

    const markerMeshes: any[] = [];
    const cityByMesh = new Map<any, ExtraWorkbenchMarker>();
    const haloByMarkerId = new Map<string, any>();

    markers.forEach((marker) => {
      const color = new THREE.Color(colorFromGradient(marker.color));
      const markerGroup = new THREE.Group();
      const position = latLngToVector3(marker.lat, marker.lng, GLOBE_RADIUS + 0.03);
      markerGroup.position.copy(position);
      markerGroup.lookAt(position.clone().multiplyScalar(2));

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 18, 18),
        new THREE.MeshBasicMaterial({ color })
      );
      markerGroup.add(dot);

      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.085, 48),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        })
      );
      halo.position.z = 0.001;
      markerGroup.add(halo);

      dot.userData.cityId = marker.id;
      markerMeshes.push(dot);
      cityByMesh.set(dot, marker);
      haloByMarkerId.set(marker.id, halo);
      root.add(markerGroup);
    });

    const routeGroup = new THREE.Group();
    root.add(routeGroup);
    const routePulseByGroupId = new Map<string, any>();

    routeItems.forEach((item) => {
      const groupMarkers = markers.filter((marker) => marker.groupId === item.groupId);
      if (groupMarkers.length < 2) return;

      for (let index = 0; index < groupMarkers.length - 1; index += 1) {
        const from = groupMarkers[index];
        const to = groupMarkers[index + 1];
        const points = buildArcPoints(from, to);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: colorFromGradient(from.color),
          transparent: true,
          opacity: 0.22
        });
        const line = new THREE.Line(geometry, lineMaterial);
        line.userData.groupId = item.groupId;
        routeGroup.add(line);

        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 14, 14),
          new THREE.MeshBasicMaterial({
            color: colorFromGradient(from.color),
            transparent: true,
            opacity: 0.85
          })
        );
        pulse.position.copy(points[0]);
        pulse.userData.points = points;
        pulse.userData.groupId = item.groupId;
        pulse.userData.progress = Math.random();
        routePulseByGroupId.set(item.groupId, pulse);
        routeGroup.add(pulse);
      }
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pendingPointer = new THREE.Vector2();
    const targetQuaternion = new THREE.Quaternion().copy(root.quaternion);
    const tempQuaternion = new THREE.Quaternion();
    const tempVector = new THREE.Vector3();
    const hoveredScale = new THREE.Vector3(1.5, 1.5, 1.5);
    const selectedScale = new THREE.Vector3(1.25, 1.25, 1.25);
    const defaultScale = new THREE.Vector3(1, 1, 1);
    let lastInteractionAt = performance.now();
    let pointerDirty = false;
    let selectedGroupId = '';

    const focusCountry = (countryNode: ExtraWorkbenchCountryNode) => {
      targetQuaternion.copy(quaternionForLatLng(countryNode.lat, countryNode.lng));
      selectedGroupId = countryNode.groups[0]?.id || '';
    };
    focusCountryRef.current = (countryCode: string) => {
      const countryNode = countryNodes.find((item) => item.countryCode === countryCode);
      if (!countryNode) return;
      focusCountry(countryNode);
      lastInteractionAt = performance.now();
    };

    const initialCountry =
      countryNodes.find((country) => country.countryCode === selectedCountryCodeRef.current) ?? countryNodes[0];
    if (initialCountry) {
      focusCountry(initialCountry);
      root.quaternion.copy(targetQuaternion);
    }

    const updateHoveredCountry = (countryCode: string | null) => {
      setHoveredCountryCode((current) => (current === countryCode ? current : countryCode));
      renderer.domElement.style.cursor = countryCode ? 'pointer' : 'grab';
    };

    const onPointerMove = (event: PointerEvent) => {
      lastInteractionAt = performance.now();
      const rect = renderer.domElement.getBoundingClientRect();
      pendingPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pendingPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointerDirty = true;
    };

    const onPointerLeave = () => {
      pointerDirty = false;
      updateHoveredCountry(null);
      setHoverLabel(null);
    };

    const onClick = () => {
      if (!hoveredCountryCodeRef.current) return;
      const countryNode = countryNodes.find((item) => item.countryCode === hoveredCountryCodeRef.current);
      if (!countryNode) return;
      setSelectedCountryCode(countryNode.countryCode);
      focusCountry(countryNode);
      lastInteractionAt = performance.now();
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('click', onClick);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(container.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let animationId = 0;
    const tick = () => {
      animationId = window.requestAnimationFrame(tick);
      const elapsed = performance.now() / 1000;

      if (!prefersReducedMotion && performance.now() - lastInteractionAt > 2200) {
        root.rotation.y += 0.0025;
      }

      tempQuaternion.copy(root.quaternion).slerp(targetQuaternion, prefersReducedMotion ? 0.18 : 0.08);
      root.quaternion.copy(tempQuaternion);

      if (pointerDirty) {
        pointer.copy(pendingPointer);
        raycaster.setFromCamera(pointer, camera);
        const countryHit = raycaster.intersectObjects(countryHitMeshes, false)[0];
        if (countryHit?.object?.userData?.countryCode) {
          updateHoveredCountry(countryHit.object.userData.countryCode);
        } else {
          const markerHit = raycaster.intersectObjects(markerMeshes, false)[0];
          if (markerHit) {
            const marker = cityByMesh.get(markerHit.object);
            updateHoveredCountry(marker?.countryCode ?? null);
          } else {
            updateHoveredCountry(null);
          }
        }
        pointerDirty = false;
      }

      markerMeshes.forEach((mesh) => {
        const marker = cityByMesh.get(mesh);
        const isHovered = marker?.countryCode === hoveredCountryCodeRef.current;
        const isSelected = marker?.countryCode === selectedCountryCodeRef.current;
        mesh.scale.lerp(isHovered ? hoveredScale : isSelected ? selectedScale : defaultScale, 0.18);
        const halo = marker ? haloByMarkerId.get(marker.id) : null;
        if (halo) {
          const targetOpacity = isHovered ? 0.92 : isSelected ? 0.74 : 0.42;
          halo.material.opacity += (targetOpacity - halo.material.opacity) * 0.18;
        }
      });

      countryNodes.forEach((countryNode, index) => {
        const parts = countryMeshByCode.get(countryNode.countryCode);
        if (!parts) return;
        const isHovered = countryNode.countryCode === hoveredCountryCodeRef.current;
        const isSelected = countryNode.countryCode === selectedCountryCodeRef.current;
        const glowScale = isHovered ? 1.58 : isSelected ? 1.2 : 0.92;
        const plateScale = isHovered ? 2.25 : isSelected ? 1.2 : 0.94;
        const sweepScale = isHovered ? 1 + (((elapsed * 1.2 + index * 0.12) % 1) * 1.8) : 0.72;
        parts.glow.scale.lerp(tempVector.set(glowScale, glowScale, glowScale), 0.14);
        parts.glow.material.opacity += ((isHovered ? 0.8 : isSelected ? 0.3 : 0.08) - parts.glow.material.opacity) * 0.14;
        parts.plate.scale.lerp(tempVector.set(plateScale, plateScale, plateScale), 0.16);
        parts.plate.material.opacity += ((isHovered ? 0.28 : isSelected ? 0.08 : 0.015) - parts.plate.material.opacity) * 0.16;
        parts.sweep.scale.setScalar(sweepScale);
        parts.sweep.material.opacity = isHovered ? Math.max(0, 0.24 - (((elapsed * 1.2 + index * 0.12) % 1) * 0.18)) : 0;
        parts.pulse.scale.setScalar(isHovered ? 1.12 : isSelected ? 0.94 : 0.84);
        parts.pulse.material.opacity = isHovered ? 0.18 : isSelected ? 0.06 : 0;
        parts.boundaryMaterials.forEach((material: any) => {
          const targetOpacity = isHovered ? 0.98 : isSelected ? 0.5 : 0.22;
          material.opacity += (targetOpacity - material.opacity) * 0.14;
        });
      });

      const hoveredCode = hoveredCountryCodeRef.current;
      if (hoveredCode) {
        const parts = countryMeshByCode.get(hoveredCode);
        const countryNode = countryNodes.find((item) => item.countryCode === hoveredCode);
        if (parts && countryNode) {
          const projected = parts.anchor.clone().applyQuaternion(root.quaternion).project(camera);
          const x = ((projected.x + 1) / 2) * container.clientWidth;
          const y = ((-projected.y + 1) / 2) * container.clientHeight;
          const visible = projected.z < 1 && projected.z > -1;
          setHoverLabel((current) => {
            if (
              current &&
              current.countryCode === hoveredCode &&
              Math.abs(current.x - x) < 1 &&
              Math.abs(current.y - y) < 1 &&
              current.visible === visible
            ) {
              return current;
            }
            return {
              countryCode: hoveredCode,
              country: countryNode.country,
              x,
              y,
              visible
            };
          });
        }
      } else {
        setHoverLabel((current) => (current ? null : current));
      }

      routeGroup.children.forEach((child: any) => {
        if (child.material?.opacity !== undefined) {
          const active = child.userData.groupId === selectedGroupId;
          child.material.opacity += ((active ? 0.92 : 0.14) - child.material.opacity) * 0.1;
        }
      });

      routePulseByGroupId.forEach((pulse) => {
        const points = pulse.userData.points as any[];
        if (!points || points.length === 0) return;
        const active = pulse.userData.groupId === selectedGroupId;
        pulse.visible = active;
        if (!active) return;
        pulse.userData.progress = (pulse.userData.progress + (prefersReducedMotion ? 0.004 : 0.01)) % 1;
        const pointIndex = Math.floor(pulse.userData.progress * (points.length - 1));
        pulse.position.copy(points[pointIndex]);
      });

      scanLines.children.forEach((child: any, index: number) => {
        child.material.opacity = 0.035 + Math.max(0, Math.sin(elapsed * 1.1 - index * 0.45)) * 0.045;
      });

      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('click', onClick);
      controls.dispose();
      focusCountryRef.current = null;
      scene.traverse((object: any) => {
        const mesh = object as any;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else if (material) {
          material.dispose();
        }
      });
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [countryNodes, geoData, markers, prefersReducedMotion, routeItems, webglSupported]);

  useEffect(() => {
    const targetCountry =
      countryNodes.find((country) => country.countryCode === selectedCountryCode) ?? countryNodes[0];
    if (!targetCountry) return;
    selectedCountryCodeRef.current = targetCountry.countryCode;
    focusCountryRef.current?.(targetCountry.countryCode);
  }, [countryNodes, selectedCountryCode]);

  const selectedCountry =
    countryNodes.find((country) => country.countryCode === selectedCountryCode) ?? countryNodes[0];
  const previewCountry =
    countryNodes.find((country) => country.countryCode === hoveredCountryCode) ?? selectedCountry;
  const previewGroup = previewCountry?.groups[0];
  const previewMarker = previewCountry?.markers[0];
  const previewCountryName = previewCountry
    ? getExtraDisplayCountryName(previewCountry.countryCode, previewCountry.country, language)
    : '';
  const hoverLabelCountryName = hoverLabel
    ? getExtraDisplayCountryName(hoverLabel.countryCode, hoverLabel.country, language)
    : '';

  const workbenchTitle = t('extra.workbench.title') as string;
  const workbenchDescription = t('extra.workbench.description') as string;

  return (
    <section className="relative border-y border-slate-800/70 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#020617_45%,#000000_100%)] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100/75">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {t('extra.workbench.chip') as string}
          </div>
          <h2 className="text-3xl font-black tracking-[0.05em] text-slate-50 md:text-4xl">
            {workbenchTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300/85 md:text-base">
            {workbenchDescription}
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(320px,5fr)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] border border-slate-800/80 bg-slate-950/60 p-3 shadow-[0_40px_120px_rgba(2,6,23,0.75)]"
          >
            <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-800/70">
              <div ref={canvasRef} className="h-[360px] w-full md:h-[460px]" />
              {!webglSupported ? <GlobeFallback country={previewCountry} language={language} /> : null}
              {hoverLabel && hoverLabel.visible ? (
                <div
                  className="pointer-events-none absolute"
                  style={{
                    left: hoverLabel.x,
                    top: hoverLabel.y,
                    transform: 'translate(18px, -56px)'
                  }}
                >
                  <div className="absolute left-[-18px] top-[42px] h-px w-5 bg-cyan-300/70 shadow-[0_0_12px_rgba(103,232,249,0.75)]" />
                  <div className="absolute left-[-2px] top-[36px] h-3 w-3 rounded-full border border-cyan-300/80 bg-cyan-300/35 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
                  <div className="rounded-2xl border border-cyan-300/30 bg-slate-950/88 px-4 py-2 shadow-[0_12px_32px_rgba(2,6,23,0.75)] backdrop-blur-md">
                    <div className="text-[0.58rem] uppercase tracking-[0.28em] text-cyan-200/70">
                      {language === 'zh-CN' ? '国家聚焦' : 'Country Focus'}
                    </div>
                    <div className="mt-1 whitespace-nowrap text-sm font-semibold text-slate-50 md:text-base">
                      {hoverLabelCountryName}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-slate-700/80 bg-slate-950/75 px-4 py-2 text-[0.72rem] text-slate-200/80 shadow-[0_12px_32px_rgba(2,6,23,0.75)]">
                {t('extra.workbench.hint') as string}
              </div>
              <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-cyan-400/20 bg-slate-950/75 px-4 py-2 text-[0.7rem] uppercase tracking-[0.26em] text-cyan-100/75 shadow-[0_12px_32px_rgba(2,6,23,0.65)]">
                {t('extra.workbench.scanLabel') as string}
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="flex flex-col gap-4 rounded-[2rem] border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.72)]"
          >
            {previewCountry ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        {t('extra.workbench.panelLabel') as string}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-50">
                        {previewCountryName}
                      </h3>
                      <p className="mt-2 text-sm text-cyan-200/75">
                        {previewGroup
                          ? language === 'zh-CN'
                            ? previewGroup.zhTitle
                            : previewGroup.enTitle
                          : ''}
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-200">
                      {previewCountry.groupCodes.join(' / ')}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300/90">
                    {(t('extra.workbench.countrySummary', {
                      cities: previewCountry.cityCount,
                      groups: previewCountry.groupIds.length
                    }) as string) || ''}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-300/80">
                    {previewGroup
                      ? language === 'zh-CN'
                        ? previewGroup.zhTagline
                        : previewGroup.enTagline
                      : ''}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
                    <div className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-500">
                      {t('extra.workbench.stats.members') as string}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-slate-50">
                      {previewCountry.memberCount}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
                    <div className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-500">
                      {t('extra.workbench.stats.frames') as string}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-slate-50">
                      {previewCountry.frameCount}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3">
                    <div className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-500">
                      {t('extra.workbench.stats.notes') as string}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-slate-50">
                      {previewCountry.messageCount}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-slate-800/70 bg-slate-900/70 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                    {t('extra.workbench.countryMetaTitle') as string}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {previewCountry.cities.map((city) => (
                      <span
                        key={city}
                        className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-200"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                    {t('extra.workbench.membersTitle') as string}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {previewCountry.activeMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        disabled={member.isPlaceholder}
                        onClick={() =>
                          navigate(`/extra/group/${previewMarker?.groupId || previewCountry.groupIds[0]}/member/${member.id}`)
                        }
                        className="rounded-full border border-slate-700/80 bg-slate-900/85 px-3 py-1.5 text-xs text-slate-200 transition hover:border-cyan-400/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {member.isPlaceholder ? member.enKeyword : member.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => previewGroup && navigate(`/extra/group/${previewGroup.id}`)}
                    className="inline-flex items-center rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    {t('extra.workbench.actions.viewGroup') as string}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!previewMarker) return;
                      const memberId = getRandomMemberIdFromWorkbenchMarker(previewMarker);
                      if (!memberId) return;
                      navigate(`/extra/group/${previewMarker.groupId}/member/${memberId}`);
                    }}
                    className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/90 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:text-white"
                  >
                    {t('extra.workbench.actions.randomMember') as string}
                  </button>
                </div>
              </>
            ) : null}
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.06 }}
          className="mt-6 rounded-[1.6rem] border border-slate-800/80 bg-slate-950/55 px-5 py-4 shadow-[0_24px_72px_rgba(2,6,23,0.65)]"
        >
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">
            {t('extra.workbench.routeTitle') as string}
          </div>
          <div className="flex flex-wrap gap-3">
            {routeItems.map((item) => {
              const active = !!previewCountry?.groupIds.includes(item.groupId);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const firstCountry = countryNodes.find((country) => country.groupIds.includes(item.groupId));
                    if (firstCountry) setSelectedCountryCode(firstCountry.countryCode);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? 'border-cyan-400/70 bg-cyan-400/12 text-cyan-100'
                      : 'border-slate-700/80 bg-slate-900/75 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {item.countryCodes?.length
                    ? item.countryCodes
                        .map((countryCode: string, index: number) =>
                          getExtraDisplayCountryName(
                            countryCode,
                            item.countries[index] || countryCode,
                            language
                          )
                        )
                        .join(' / ')
                    : item.label || item.code}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExtraGlobeWorkbench;
