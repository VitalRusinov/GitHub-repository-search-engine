import { useState } from 'react';
import { CssBaseline, Box, OutlinedInput, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


import styles from './Header.module.scss'

//Поменять тип
interface PropsType {
  setQ: any,
  isLoading: boolean,
}

export const Header = ({ setQ, isLoading }: PropsType) => {

  const [inputValue, setInputValue] = useState('')

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setQ(inputValue);
  }

  return (
    <Box
      className={styles.form}
      component='form'
      onSubmit={handleSubmit}
    >
      <OutlinedInput
        placeholder="Введите поисковый запрос"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        sx={{
          height: '42px',
          width: '912px',
          background: '#F2F2F2',
        }}
      />
      <LoadingButton
        type='submit'                
        loading={isLoading}
        variant="contained"
       >
        <span>ИСКАТЬ</span>
      </LoadingButton>
    </Box>
  )
};