import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BreedList } from './components/BreedList';
import { BreedDetail } from './components/BreedDetail';
import { BreedForm } from './components/BreedForm';
import { SearchBreeds } from './components/SearchBreeds';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<BreedList />} />
        <Route path="/breeds/:id" element={<BreedDetail />} />
        <Route path="/breeds/new" element={<BreedForm />} />
        <Route path="/breeds/:id/edit" element={<BreedForm />} />
        <Route path="/search" element={<SearchBreeds />} />
      </Routes>
    </Layout>
  );
}

export default App; 