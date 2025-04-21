export default function FoodPlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
      <span className="text-center p-4">{name || "Food Item"}</span>
    </div>
  )
}
