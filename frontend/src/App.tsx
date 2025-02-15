
import './App.css'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function App() {


  return (
    <>
      <h1 className='text-red-500'>hello...</h1>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

    </>
  )
}

export default App
