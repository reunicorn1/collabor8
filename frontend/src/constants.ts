import { HiUsers } from 'react-icons/hi2';
import { PiCursorClickFill } from 'react-icons/pi';
import { ImDatabase } from 'react-icons/im';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import * as Y from 'yjs';
import { Github, LinkedIn, Twitter } from './common/icons';

const TEXT =
  '\r\r\rCollabor8 is your ultimate code collaboration tool. Code with your team in real-time, and never miss a beat.';
const AVATARS = [
  {
    name: 'Abdallah Abdelrahman',
    img: '/aa.png',
    borderColor: '#52A0D8',
    socials: [
      { link: 'https://www.linkedin.com/in/abdallah-alkaser/', Icon: LinkedIn },
      { link: 'https://x.com/foola_sust', Icon: Twitter },
      { link: 'https://github.com/Abdallah-Abdelrahman', Icon: Github },
    ],
  },

  {
    name: 'Mohamed Elfadil',
    img: '/mea.png',
    borderColor: '#F16145',
    socials: [
      { link: 'https://www.linkedin.com/in/mohamedelfadil/', Icon: LinkedIn },
      { link: 'https://x.com/mo_elfadil', Icon: Twitter },
      { link: 'https://github.com/mo7amedElfadil', Icon: Github },
    ],
  },

  {
    name: 'Mohannad Babiker',
    img: '/mab.png',
    borderColor: '#76449A',
    socials: [
      {
        link: 'https://www.linkedin.com/in/mohannad-abdul-aziz-babeker/',
        Icon: LinkedIn,
      },
      { link: 'https://x.com/mohanad_abdo21', Icon: Twitter },
      { link: 'https://github.com/Mohabdo21', Icon: Github },
    ],
  },

  {
    name: 'Reem Osama',
    img: '/ro.png',
    borderColor: '#F6D277',
    socials: [
      { link: 'https://www.linkedin.com/in/reosama/', Icon: LinkedIn },
      { link: 'https://x.com/iReOsama', Icon: Twitter },
      { link: 'https://github.com/reunicorn1', Icon: Github },
    ],
  },
];
const FEATURES = [
  {
    title: 'Instant Updates',
    description: `Experience the power of real-time editing where every team
              member can see changes as they happen. No need to refresh or
              wait for updates—your document evolves instantly as your team
              works together.`,
    Icon: HiUsers,
    borderColor: '#F16145',
  },
  {
    title: 'Live Cursor Tracking',
    description: `Keep track of who’s working on what with live cursors,
        highlighting, and color-coded indicators for each collaborator.
        You’ll always know where your teammates are making edits.`,
    Icon: PiCursorClickFill,
    borderColor: '#52A0D8',
  },
  {
    title: 'Secure Data Storage',
    description: `All your documents are stored securely on our servers with
        robust security measures in place to protect against data
        breaches and unauthorized access. Your work is not only
        accessible when you need it but also protected from threats.`,
    Icon: ImDatabase,
    borderColor: '#F6D277',
  },
  {
    title: 'Clean and Simple Design',
    description: `Our user-friendly interface is designed to keep you focused on
        your work. Whether you’re tech-savvy or a novice, Collabor8’s
        intuitive design ensures that anyone can start collaborating
        immediately.`,
    Icon: TbLayoutDashboardFilled,
    borderColor: '#76449A',
  },
];

const EXECUTION_PANEL_FILLER_TEXT = 'Your result appears here!';

/**
 * @class Singleton
 * @description Singleton class to create a single instance of Y.Doc
 * @returns {Y.Doc} ydoc
 * @example
 * const ydoc = Singleton.getYdoc();
 */
class Singleton {
  static instance: Singleton = null;
  ydoc: Y.Doc;

  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    this.ydoc = new Y.Doc();

    return this;
  }

  static getYdoc(): Y.Doc {
    return new Singleton().ydoc;
  }
}

export { TEXT, AVATARS, FEATURES, EXECUTION_PANEL_FILLER_TEXT, Singleton };
