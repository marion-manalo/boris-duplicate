import Welcome from "./Welcome";
import './Splash.css';
import borisStyle from '@/assets/boris-style.png';
import boris from '@/assets/boris.png';
import login from '@/assets/login.png';
import view from '@/assets/view-report.png';
import dash from '@/assets/Dashboard.png';
import report from '@/assets/styled-report.png';
import ImageSlide from './ImageSlide/ImageSlide';

// setup and style splash page
const Splash = () => {
  const imageItems = [
    {
      image: borisStyle,
      title: '',
      description: '',
    },
    {
      image: login,
      title: 'Step 1',
      description: 'Log in / Create an account',
    },
    {
      image: dash,
      title: 'Step 2',
      description: 'Enter a stock ticker and a type of filing.',
    },
    {
      image: view,
      title: 'Step 3',
      description: 'View report',
    },
    {
      image: report,
      title: 'Step 4',
      description: 'Learn about companies and what different data means!',
    },
  ];

  // return splash page with proper setup/styling
  return (
    <div className="splash-container">
      <Welcome />
      <ImageSlide items={imageItems} />
    </div>
  );
};

export default Splash;
