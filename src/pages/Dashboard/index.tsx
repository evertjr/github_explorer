import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repo, setRepo] = useState<Repository[]>(() => {
    const storageRepo =  localStorage.getItem('@GithubExplorer:repo');
    if(storageRepo) {
      return JSON.parse(storageRepo)
    } else {
      return []
    }
  });

  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repo', JSON.stringify(repo))
  }, [repo])

  async function handleAddRepo(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if(!newRepo) {
      setInputError('Digite autor/nome do repositório');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repositoriy =  response.data;

      setRepo([...repo, repositoriy])

      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Não foi possível encontrar o repositório')
    }


  }
  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepo}>
        <input
          placeholder="Digite o nome do repositório"
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

  {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repo.map(r => (
                  <Link key={r.full_name} to={`/repository/${r.full_name}`}>
                  <img
                    src={r.owner.avatar_url}
                    alt={r.owner.login}
                  />
                  <div>
                    <strong>{r.full_name}</strong>
                    <p>{r.description}</p>
                  </div>
                  <FiChevronRight size={20} />
                </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
