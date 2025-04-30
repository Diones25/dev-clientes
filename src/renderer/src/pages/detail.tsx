import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Trash } from 'phosphor-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ['customer'], queryFn: async () => {
      const response = await window.api.fetchCustomerById(id!);
      return response;
    }
  });

  const { isPending, mutateAsync: deleteCustomerById } = useMutation({ mutationFn: async (id: string) => {
    try {
      await window.api.deleteCustomerById(id);
      
    } catch (error) {
      console.log("Deu erro", error)
    }
  }, onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    navigate('/');
  }});

  async function handleDeleteCustomer(id: string) {
    await deleteCustomerById(id);
  }

  return (
    <main className="flex-1 flex flex-col py-12 px-10 text-white">
      <Link to="/" className='flex items-center gap-2 mb-2'>
        <ArrowLeft className="w-6 h-6 text-white" />
        <span>Voltar</span>
      </Link>

      <h1 className='text-white text-xl lg:text-3xl font-semibold mb-4'>
        Detalhes do cliente
      </h1>

      <section className='flex flex-col gap-6 w-full'>
        {isFetching && (
          <p className='text-white'>Carregando...</p>
        )}

        {!isFetching && data && (
          <article className='w-full relative flex flex-col gap-1'>
            <section className='bg-gray-800 rounded px-4 py-3'>
              <p className='mb-2 font-semibold text-lg'>{data.name}</p>
              <p>
                <span className='font-semibold'>Email: </span>{data.email}
              </p>

              {data.address && (
                <p><span className='font-semibold'>Endereço: </span>{data.address}</p>
              )}

              {data.phone && (
                <p><span className='font-semibold'>Telefone: </span>{data.phone}</p>
              )}

              <div className='absolute right-4 top-2'>
                <button
                  className='bg-red-500 hover:bg-red-600 p-2 rounded-full disabled:bg-red-300'
                  onClick={() => handleDeleteCustomer(data._id)}
                  disabled={isPending}
                >
                  <Trash className='w-6 h-6 text-white' />
                </button>
              </div>

            </section>

            <section className='bg-gray-800 rounded px-4 py-3'>
              <p>
                <span className='font-semibold'>Cargo: </span>{data.role}
              </p>
              <p>
                <span className='font-semibold'>Status atual: </span>{data.status ? "ATIVO" : "INATIVO"}
              </p>
            </section>
          </article>
        )}
      </section>
    </main>
  )
}