"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { supabase } from "@/lib/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Header from "@/components/Header";

type Usuario = {
  nome: string
  avatar_url?: string
  papel?: string
}


export default function AdicionarProdutoPage() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("novo");
  const [imagens, setImagens] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    setImagens(fileArray);
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  useEffect(() => {
    async function fetchDados() {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      // Busca dados do usuário na tabela "usuarios"
      const { data: dadosUsuario } = await supabase
        .from('usuarios')
        .select('nome, avatar_url, papel')
        .eq('user_id', user.id)
        .single()

      if (dadosUsuario) {
        setUsuario({
          nome: dadosUsuario.nome,
          avatar_url: dadosUsuario.avatar_url,
          papel: dadosUsuario.papel
        })
      }

      // Busca métricas
      // const [prod, aval, vend] = await Promise.all([
      //   supabase
      //     .from('produtos')
      //     .select('id', { count: 'exact', head: true })
      //     .eq('user_id', user.id),
      //   supabase
      //     .from('avaliacoes')
      //     .select('id', { count: 'exact', head: true })
      //     .eq('usuario_id', user.id),
      //   supabase
      //     .from('itens_pedido')
      //     .select('quantidade', { count: 'exact', head: true })
      //     .eq('usuario_id', user.id) // ajuste aqui se necessário
      // ])

    }

    fetchDados()
  }, [])

    const [usuario, setUsuario] = useState<Usuario>({
      nome: '',
      avatar_url: '',
      papel: ''
    })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data: produto, error } = await supabase
      .from("produtos")
      .insert([
        {
          nome,
          descricao,
          preco: parseFloat(preco),
          categoria,
          tipo,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error || !produto) {
      console.error("Erro ao salvar produto:", error);
      setUploading(false);
      return;
    }

    for (const imagem of imagens) {
      const filePath = `image/${uuidv4()}-${imagem.name}`;
      const { error: uploadError } = await supabase.storage
        .from("box")
        .upload(filePath, imagem);

      if (uploadError) {
        console.error("Erro ao subir imagem:", uploadError);
        continue;
      }

      await supabase.from("fotos_produtos").insert([
        {
          produto_id: produto.id,
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/box/${filePath}`,
        },
      ]);
    }

    setUploading(false);
    alert("Produto cadastrado com sucesso!");
  };

  return (
    <div className="w-full bg-slate-100 text-black mx-auto py-10 px-4">
            <Header
        nome={usuario.nome}
        avatar_url={usuario.avatar_url}
        papel={usuario.papel}
      />
      <h1 className="text-3xl font-bold mb-6">📦 Adicionar Produto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="novo">Novo</option>
          <option value="usado">Usado</option>
        </select>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagemChange}
          className="w-full"
        />

        <div className="flex flex-wrap gap-4">
          {previews.map((url, idx) => (
            <Image
              key={idx}
              src={url}
              alt={`Preview ${idx}`}
              width={100}
              height={100}
              className="rounded shadow"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          {uploading ? "Salvando..." : "Cadastrar Produto"}
        </button>
      </form>
    </div>
  );
}