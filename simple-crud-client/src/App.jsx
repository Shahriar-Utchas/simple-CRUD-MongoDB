import './App.css'
import Users from './Components/Users'


const userPromise = fetch('http://localhost:4000/users')
  .then(res => res.json())
function App() {

  return (
    <div>
      <h1>Simple crud</h1>
      <Users userPromise={userPromise}></Users>
    </div>
  )
}

export default App
