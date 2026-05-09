import { CircleQuestionMark, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-8 py-3">
      <h1 className="font-heading text-xl font-semibold">Next Form</h1>
      <div className="flex items-center gap-2">
        <button><Settings size={25} /></button>
        <button><CircleQuestionMark size={25} /></button>
        <Button className="border-2 border-solid border-primary bg-transparent text-lg text-primary duration-300 hover:text-white">
          Preview
        </Button>
        <Button className="text-lg">Publish</Button>
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://placehold.co/800x600" />
          <AvatarFallback>Placeholder image</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
