import { Spinner } from "@heroui/spinner";
export default function Loading() {
  return (
    <div className='flex justify-center items-center'>
      <Spinner label='Chargement...' color='primary' size='lg' />
    </div>
  );
}