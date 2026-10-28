import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

function Layout() {
  return (
    <div className="layout">
      <ScrollToTop />
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;