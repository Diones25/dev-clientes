import { useQueryClient, useMutation } from '@tanstack/react-query';
import { FormEvent, useRef } from 'react';
import {useNavigate} from 'react-router-dom';

interface DataMutation {
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
}

export function Create() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLInputElement | null>(null);

  const { isPending, mutateAsync: createCustomer } = useMutation({mutationFn: async (data: DataMutation) => {
     await window.api.addCustomer({
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      role: data.role,
      status: true
    }).then((_) => {
      console.log("Cadastrado com sucesso")
      navigate('/')
    })
    .catch((err) => {
      console.log("Deu erro",err)
    })
  },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['customers']});
    }
  })
  
  async function handleAddCustomer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const address = addressRef.current?.value;
    const phone = phoneRef.current?.value;
    const role = roleRef.current?.value;

    if (!name || !email || !address || !phone || !role) {
      return;
    }
    
    await createCustomer({
      name: name,
      email: email,
      address: address,
      phone: phone,
      role: role
    });
  }

  return (
    <div className="flex-1 flex flex-col py-12 px-10 gap-8 overflow-y-auto">
      <section className="flex flex-1 flex-col items-center">
        <h1 className="text-white lg:text-3xl font-semibold">Cadastrar novo cliente</h1>

        <form className="w-full max-w96 mt-4" onSubmit={handleAddCustomer}>
          <div className="mb-2">
            <label className="text-lg" htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite nome do cliente..."
              className="w-full h-9 rounded text-black bg-white px-2"
              ref={nameRef}
            />
          </div>

          <div className="mb-2">
            <label className="text-lg" htmlFor="nome">Endereço:</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu endereço completo..."
              className="w-full h-9 rounded text-black bg-white px-2"
              ref={addressRef}
            />
          </div>

          <div className="mb-2">
            <label className="text-lg" htmlFor="nome">Email:</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu email..."
              className="w-full h-9 rounded text-black bg-white px-2"
              ref={emailRef}
            />
          </div>

          <div className="mb-2">
            <label className="text-lg" htmlFor="nome">Cargo:</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu cargo..."
              className="w-full h-9 rounded text-black bg-white px-2"
              ref={roleRef}
            />
          </div>

          <div className="mb-4">
            <label className="text-lg" htmlFor="nome">Telefone:</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu telefone..."
              className="w-full h-9 rounded text-black bg-white px-2"
              ref={phoneRef}
            />
          </div>

          <button
            type="submit"
            className="w-full h-9 rounded flex items-center justify-center bg-blue-500 disabled:bg-gray-500"
            disabled={isPending}
          >
            Cadastrar
          </button>
        </form>
      </section>
    </div>
  )
}