import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { Home } from './components/screens/home/Home';
import { Toaster } from "react-hot-toast"
const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      {/* using react-router multiple routes can be added (simplified to one route)*/}
      <div className='container mx-auto'>
        <Home />
      </div>
      <Toaster/>
    </QueryClientProvider>
  )
}

export default App 