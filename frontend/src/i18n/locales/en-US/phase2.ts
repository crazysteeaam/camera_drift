/**
 * English Translations - Phase 2 Related Pages
 * 
 * Contains translations for Phase2Home, Phase2Province, Phase2RelayDetail pages
 */

export default {
  // Home page (Phase2Home)
  home: {
    title: 'Light Up China · Film Camera Relay',
    subtitle: '100 film cameras, keeping life glowing in 300+ cities',
    description: 'One camera, six frames, one message book. We invite people who love documenting to dialogue with cities, exchange stories with strangers far away, and let the warmth of life continue to drift along with images.',
    
    // Home page buttons
    buttons: {
      viewGallery: 'Browse Gallery',
      viewProgress: 'View Progress'
    },
    
    // Home page sections
    sections: {
      // Map section
      map: {
        title: 'National Map',
        description: 'Light up every city in China, view the national distribution of the film relay project',
        statistics: {
          title: 'Province Statistics',
          totalProvinces: 'Total Provinces',
          status: {
            label: 'Status',
            completed: 'Completed',
            active: 'Active',
            planning: 'Planning',
            completedTime: 'Completed Time',
            currentTime: 'Current Time',
            planningStart: 'Planning Start'
          }
        }
      },
      
      // Provinces section
      provinces: {
        title: 'Participating Provinces',
        description: 'Light up every city in China. Each province has different numbers of groups, and each group consists of 6 participants forming a relay'
      },
      
      // Activity instructions section
      activity: {
        title: 'Activity Instructions',
        process: {
          title: 'Participation Process',
          steps: [
            'Each participant will receive 1 disposable film camera (24 frames) + 1 relay notebook',
            'You only need to shoot 6 frames and write something you want to say',
            'Keep it for up to 5 days, contact the organizer after shooting',
            'We will tell you the address of the next person, you only need to pay a little postage',
            'Finally, we will develop these photos, scan the messages, and publish a complete exhibition on Xiaohongshu'
          ]
        },
        conditions: {
          title: 'Participation Conditions',
          description: 'We want to light up every city in China. Whether you are:',
          roles: ['Middle school student', 'College student', 'Office worker', 'Delivery rider', 'Shop owner', 'Programmer', 'Writer'],
          conclusion: 'Whether from the high-rises of the city, or from the small streets and alleys of the county town,\nyou deserve to have your own shutter story once.'
        },
        xiaohongshu: {
          title: 'Follow my Xiaohongshu account',
          account: '7527914100',
          description: 'Follow for progress updates and activity news',
          scan: 'Scan to follow'
        }
      },
      
      // Registration section
      registration: {
        title: 'Registration is Now Open',
        description: 'Please fill in the following information carefully. We will arrange the relay route reasonably according to time, city, and pace.',
        notice: 'If you are selected, we will contact you within half a month.',
        button: 'Register Now',
        thanks: 'Thank you for letting a camera see the world.'
      }
    },
    
    // Filters
    filters: {
      status: {
        all: 'All',
        active: 'Active',
        planning: 'Planning',
        completed: 'Completed'
      },
      province: 'Province Filter',
      group: 'Group Filter'
    }
  },
  
  // Province page (Phase2Province)
  province: {
    notFound: 'Province not found',
    back: 'Back to Home',
    
    // Statistics
    stats: {
      totalGroups: 'Total Groups',
      active: 'Active',
      completed: 'Completed',
      totalParticipants: 'Total Participants'
    },
    
    // Map
    map: {
      title: 'City Distribution Map',
      description: 'Explore the relay situation of cities in {{province}}, click markers to view details'
    },
    
    // Search and filter
    search: {
      placeholder: 'Search groups...',
      noResults: {
        title: 'No matching groups found',
        description: 'Please try adjusting your search criteria or filters'
      }
    },
    
    // Group list
    groups: {
      title: 'Group List',
      route: '{{start}} → {{end}}',
      participants: '{{count}} participants',
      relay: '{{current}}/{{total}} relay',
      progress: 'Progress',
      viewDetails: 'View Details'
    },
    
    // Province features
    features: {
      title: '{{province}} Features',
      culture: {
        title: 'Cultural Features',
        tags: ['History & Culture', 'Natural Scenery', 'Modern Development', 'Local Customs']
      },
      shooting: {
        title: 'Shooting Suggestions',
        tips: [
          'Document local historical buildings and cultural heritage',
          'Capture natural scenery and seasonal changes',
          'Showcase the development of modern cities',
          'Record the daily life of local people'
        ]
      }
    }
  },
  
  // Group detail page (Phase2Group)
  group: {
    notFound: 'Group not found',
    back: 'Back to Province',
    backToHome: 'Back to Home',
    
    // Statistics
    stats: {
      totalParticipants: 'Total Participants',
      currentRelay: 'Current Relay',
      progress: 'Progress',
      status: 'Status'
    },
    
    // Route info
    route: {
      start: 'Start: {{location}}',
      end: 'End: {{location}}',
      progress: 'Relay Progress',
      relay: '{{current}}/{{total}} relay'
    },
    
    // Relay list
    relays: {
      title: 'Relay Details',
      description: 'Each relay carries unique perspectives and stories',
      noPhoto: 'No Photo',
      photoCount: '📸 {{count}} photos',
      viewDetails: 'View Details',
      notStarted: {
        title: 'Group Not Started',
        description: 'The relay activity for this group has not started yet, please wait patiently'
      }
    },
    
    // Group features
    features: {
      title: '{{group}} Features',
      route: {
        title: 'Route Features'
      },
      participation: {
        title: 'Participation Instructions',
        tips: [
          'Each participant shoots 6 photos',
          'Write something you want to say in the message book',
          'Keep for up to 5 days, then pass to the next person',
          'Record local customs and cultural characteristics'
        ]
      }
    }
  },
  
  // Relay detail page (Phase2RelayDetail)
  relay: {
    notFound: 'Relay not found',
    back: 'Back to Group',
    
    // Info section titles
    info: {
      relay: 'Relay Info',
      nextStop: 'Next Stop',
      nextParticipant: 'Next Participant',
      shooting: 'Shooting Info',
      camera: 'Camera Model',
      film: 'Film Type',
      message: 'Message Info',
      messageCount: 'Message Count',
      messageType: 'Message Type',
      messageTypeValue: 'Handwritten Message',
      location: 'Shooting Location',
      viewFullRoute: 'View Full Route →',
      coordinates: 'Coordinates: {{lat}}, {{lng}}',
      participantMessage: 'Participant Message'
    },
    
    // Photos related
    photos: {
      title: 'All Photos',
      current: 'Current Photo',
      noPhoto: 'No Photo Available',
      clickToView: 'Click to view full size',
      alt: '{{name}} - Photo {{index}}',
      thumbnailAlt: 'Photo {{index}}'
    },
    
    // Message images related
    messageImages: {
      title: 'Message Images',
      all: 'All Message Images',
      noImages: 'No Message Images Available',
      count: '{{count}} images',
      type: 'Handwritten Message',
      alt: 'Message Image {{index}}',
      thumbnailAlt: 'Message {{index}}'
    },
    
    // Download related
    download: {
      title: 'Download Photos',
      all: 'Download All Photos ({{count}} images)',
      current: 'Download Current Photo',
      downloading: 'Downloading... {{progress}}%',
      notice: 'Batch download will download all photos one by one, with 0.5 seconds interval between each',
      messageTitle: 'Download Message Images',
      messageAll: 'Download All Message Images ({{count}} images)',
      messageCurrent: 'Download Current Message Image',
      messageNotice: 'Batch download will download all message images one by one, with 0.5 seconds interval between each'
    }
  }
};

