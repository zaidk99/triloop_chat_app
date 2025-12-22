import AppRouter from './routers/AppRouter';
import { useFriendSocketListeners } from './hooks/useFriendSocketListeners.js';


function App(){

  useFriendSocketListeners();

  return ( 
  <>  
    <AppRouter />
    </>
  )

}

export default App;