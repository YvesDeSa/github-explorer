import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { api } from "../../services/api";

import logoImg from '../../assets/logo.svg';

import { Header, RepositoryInfo, Issues } from "./style";

interface IRepository {
  full_name: string;
  description: string;
  forks_count: number;
  open_issues_count: number;
  stargazers_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
};

interface IIssue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
};

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<IRepository | null>(null);
  const [issues, setIssues] = useState<IIssue[]>([]);

  const { author, name } = useParams<'author' | 'name'>();

  useEffect(() => {
    api.get(`repos/${author}/${name}`).then(response => {
      setRepository(response.data);
    });

    api.get(`repos/${author}/${name}/issues`).then(response => {
      setIssues(response.data);
    });
  }, [author, name]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/" >
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo>
          <header>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Starts</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map(issue => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong> {issue.title} </strong>
              <p> {issue.user.login} </p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export { Repository };