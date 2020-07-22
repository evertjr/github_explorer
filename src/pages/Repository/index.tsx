import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

import { Header, RepoInfo, Issues } from './styles';

interface RepoParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  }
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository: React.FC = () => {

  const [repo, setRepo] = useState<Repository | null >(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { params } =  useRouteMatch<RepoParams>()

  useEffect(() => {
    api.get(`repos/${params.repository}`).then(response => {
      setRepo(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then(response => {
      setIssues(response.data);
    });

  },[params.repository])
return (
  <>
    <Header>
      <img src={logoImg} alt="Github Explorer"/>
      <Link to="/">
        <FiChevronLeft size={16} />
        Voltar
      </Link>
    </Header>

    {repo && (
      <RepoInfo>
      <header>
        <img src={repo.owner.avatar_url} alt={repo.owner.login}/>
        <div>
          <strong>{repo.full_name}</strong>
          <p>{repo.description}</p>
        </div>
      </header>
      <ul>
        <li>
          <strong>{repo.stargazers_count}</strong>
          <span>Stars</span>
        </li>
        <li>
          <strong>{repo.forks_count}</strong>
          <span>Forks</span>
        </li>
        <li>
          <strong>{repo.open_issues_count}</strong>
          <span>Issues abertas</span>
        </li>
      </ul>
    </RepoInfo>
    )}

    <Issues>
      {issues.map(i => (
              <a key={i.id} href={i.html_url}>
              <div>
                <strong>{i.title}</strong>
                <p>{i.user.login}</p>
              </div>
              <FiChevronRight size={20} />
        </a>
      ))}
    </Issues>
  </>
  );
};

export default Repository;
