import {useEffect, useState} from 'react';

import { CssBaseline, Box, Input, Typography } from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import { GridRowSelectionModel, GridRowId, GridSortModel } from '@mui/x-data-grid';

import {RepoList} from '../RepoList';
import {RepoDescription} from '../RepoDescription';
import {ErrorComponent} from '../Error';
import {Header} from '../Header';

import { useGetRepositoriesQuery } from '../../store';

import styles from './App.module.css'

const defaultPerPage = 10;
const defaultPage = 0; // Ноль из-за особенностей работы DataGrid

  // Тип объекта с инф-цией о репозитории
type Item = {
  id: number,
  name: string,
  language: string,
  forks: number,
  stargazers_count: number,
  updated_at: string,
}

type FormattedItem = {
  id: number;
  name: string;
  language: string;
  forks: number;
  stars: number;
  updated: string;
}

  // Тип положительного ответа от сервера
type Response = {
  total_count: number,
  items: Item[],
}

  // Тип форматированного положительного ответа от сервера
  type FormattedResponse = {
    total_count: number,
    items: FormattedItem[],
  }

  //Тип для хранения информации
type Data = Response | undefined;
type FormattedData = FormattedResponse | undefined;

//Используется для единообразного оформления даты ДД.ММ.ГГГГ
const formattingDayAndMonth = (date: number): string => {
  if( date >= 0 && date <= 9) {
    return String("0" + date);
  }
  return String(date);
}

const formattingItem = (item: Item): FormattedItem => {
  const date = new Date(item.updated_at);
  const day: string | number = formattingDayAndMonth(date.getDate());
  const month: string | number = formattingDayAndMonth(date.getMonth() + 1);
  const year = date.getFullYear();
  const formattedDate = day + "-" + month + "-" + year;

  const newItem = {
    id: item.id,
    name: item.name,
    language: item.language,
    forks: item.forks,
    stars: item.stargazers_count,
    updated: formattedDate,
  }
  return newItem;
};

export function App() {
//поменять тип
  const [activeRepo, setActiveRepo] = useState(null);
  const [formattedData, setFormattedData] = useState<FormattedData>(undefined);

  const [q, setQ] = useState('');
  const [per_page, setPer_page] = useState(defaultPerPage);
  const [page, setPage] = useState(defaultPage);
  const [sort, setSort] = useState<GridSortModel>([{field: '', sort: 'desc'}]);

  const { data, error, isLoading, refetch } = useGetRepositoriesQuery({
     q, per_page, page: page + 1, sort: sort[0].field, order: sort[0].sort,
    });

  useEffect(() => {
    console.log(q, per_page, page + 1, sort[0].field, sort[0].sort, '"q, per_page, page, sort.field, sort.order"')
    refetch()
  }, [q, per_page, page, sort])

  useEffect(() => {
    if(data) {
      console.log(data, 'data');
      const newItems = data.items.map(formattingItem);
      const newData = {
        total_count: data.total_count,
        items: newItems
      }
      setFormattedData(newData);

      console.log(formattedData, 'formattedData');
    }

  }, [data])

  useEffect(() => {
    console.log(error, 'error');
  }, [error])


  //"API rate limit exceeded for 37.79.16.4. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)"

  //мб не нужна (Input)
  
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   setInputValue(event.target.value)
  // }

  // поменять тип

  return (
    <Grid container className={styles.container}>
      <Grid xs={12} className={styles.header_container}>
        <Header setQ={setQ} isLoading={isLoading}/>
      </Grid>
        {formattedData === undefined
          ? <Box className={styles.greeting_box}>
              <Typography variant="body2">
                Добро пожаловать
              </Typography>
            </Box>
          : <Grid container xs={12} columns={3} className={styles.main_container}>
              <Grid xs={2} className={styles.repoList_container}>
                <ErrorComponent error={error}/>
                <RepoList 
                  data={formattedData}
                  setActiveRepo={setActiveRepo}
                  per_page={per_page}
                  setPer_page={setPer_page}
                  page={page}
                  setPage={setPage}
                  setSort={setSort}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid xs={1} className={styles.repoDescription_container}>
                <RepoDescription activeRepo={activeRepo}/>
              </Grid>
            </Grid>              
        } 
      <Grid xs={12} className={styles.footer}>
      </Grid>
    </Grid>

  );
}