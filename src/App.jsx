import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './componemts/Header';
import Footer from './componemts/footer';
import ResourceCard from './componemts/ResourceCard';
import './App.css';
// import AdminStack from '../Stacks/AdminStack';

function App() {
  const [isAuthenticated] = useState(true);
  const [isAdmin] = useState(false);

  // Temporary sample resource data so components can render
  const sampleResource = {
    id: 1,
    image: '/placeholder-resource.jpg',
    name: 'Sample Auditorium',
    location: 'Main Campus',
    capacity: 120,
    description: 'A sample resource to demonstrate the UI.',
    available: true,
  };

  return (
    
      <div className="app">
        <Header />
        <main>
          <ResourceCard
            resource={sampleResource}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
          />
        </main>
        <Footer />
      </div>
      
  );
}

export default App;
