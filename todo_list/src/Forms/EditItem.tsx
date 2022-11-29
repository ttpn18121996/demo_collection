import { useParams } from 'react-router-dom'

export default function EditItem() {
  const { itemId } = useParams();

  return (
    <>
    Edit item
      {itemId}
    </>
  )
}
