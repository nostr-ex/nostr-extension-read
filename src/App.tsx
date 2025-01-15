import { NDKProvider } from './context/NDKContext';
import Header from './components/Header';
// import MainContent from './components/MainContent';
import Footer from './components/Footer';

function App() {
  return (
    <NDKProvider>
      <div className="min-h-screen text-white flex flex-col">
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
          <Header />
          {/* <MainContent /> */}
          <Footer />
        </div>
      </div>
    </NDKProvider>
  );
}

export default App;
