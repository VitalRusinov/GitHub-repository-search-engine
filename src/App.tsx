import { useState, useEffect } from 'react';
import './App.css';
import RepoList from './components/RepoList';
import { useGetRepositoriesQuery } from './store';
import RepoDescription from './components/RepoDescription';
import Pages from './components/Pages';

const defaultPerPage = 10;

function App() {

  const [activeRepo, setActiveRepo] = useState(null)

  const [inputValue, setInputValue] = useState('')
  const [q, setQ] = useState('');
  const [per_page, setPer_page] = useState(defaultPerPage);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');

  const { data, error, isLoading, refetch } = useGetRepositoriesQuery({ q, per_page, page, sort });

  useEffect(() => {
    refetch()
  }, [q, per_page, page, sort])

  useEffect(() => {
    console.log(data, 'data');
  }, [data])

  // поменять тип
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setQ(inputValue);
  }
  // поменять тип
  const handleChange = (e:any) => {
    setInputValue(e.target.value)
  }

  const handle_setPer_page = (value: any) => {
    const newPageNumber = Math.ceil(((page - 1) * per_page + 1) / value);
    setPage(newPageNumber);
    setPer_page(value);
  }

  return (
    <div className="container">
      <header>
        <form onSubmit={handleSubmit} action="">
          <input onChange={handleChange} value={inputValue} name='search' type="text" placeholder='Введите поисковый запрос' required/>
          <button type='submit' className='search-btn'>
            ИСКАТЬ
          </button>
        </form>
      </header>
        {error ? <div>Ошибка при загрузке данных...</div> : null}
        {isLoading ? <div>Загрузка данных...</div> : null}
        {!data 
        ? <div className="greeting">
            <h1>Добро пожаловать</h1>
          </div>
        : <main>
            <div className="list-container">
              <RepoList data={data} setActiveRepo={setActiveRepo} setSort={setSort}/>
              <Pages
                per_page={per_page}
                setPer_page={handle_setPer_page}
                data={data}
                page={page}
                setPage={setPage}
              />
            </div>
            <RepoDescription activeRepo={activeRepo}/>
          </main>
        }
      <footer></footer>
    </div>
  );
}

export default App;
