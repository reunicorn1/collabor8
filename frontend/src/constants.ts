import { HiUsers } from 'react-icons/hi2';
import { PiCursorClickFill } from 'react-icons/pi';
import { ImDatabase } from 'react-icons/im';
import { TbLayoutDashboardFilled } from 'react-icons/tb';

const TEXT = '  Collabor8 is your ultimate code collaboration tool. Code with your team in real-time, and never miss a beat.';
const AVATARS = [
  { name: 'Abdallah Abdelrahman', img: '/aa.png', borderColor: '#52A0D8' },
  { name: 'Mohamed Elfadil Abdalla', img: '/mea.png', borderColor: '#F16145' },
  { name: 'Mohannad Babiker', img: '/mab.png', borderColor: '#76449A' },
  { name: 'Reem Osama', img: '/ro.png', borderColor: '#F6D277' },
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

export { TEXT, AVATARS, FEATURES };
