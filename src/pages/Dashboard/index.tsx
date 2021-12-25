import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './style';
import { api } from '../../services/api';

interface IRepository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<IRepository[]>(() => {
    const storeageRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storeageRepositories)
      return JSON.parse(storeageRepositories);

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories)
    )
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório.');
      return;
    }

    try {
      const response = await api.get<IRepository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');

    } catch {
      setInputError('Erro na busca por esse reposiório.');
    }
  };


  return <>
    <img src={logoImg} alt="GitHub Explorer" />
    <Title>Explorer repositórios no GitHub</Title>

    <Form hasError={!!inputError} onSubmit={handleAddRepository} >
      <input
        value={newRepo}
        onChange={(e) => setNewRepo(e.target.value)}
        placeholder="Digite o nome do repositório "
      />
      <button type="submit">Pesquisar</button>
    </Form>

    {inputError && <Error> {inputError} </Error>}

    <Repositories>
      {repositories.map(repository => (
        <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <div>
            <strong> {repository.full_name} </strong>
            <p> {repository.description} </p>
          </div>
          <FiChevronRight size={20} />
        </Link>
      ))}
    </Repositories>
  </>
};

export { Dashboard };