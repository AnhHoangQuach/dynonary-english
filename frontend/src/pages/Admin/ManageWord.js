import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import GlobalLoading from 'components/UI/GlobalLoading';
import { CardMedia, Switch } from '@material-ui/core';
import useTitle from 'hooks/useTitle';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import wordApi from 'apis/wordApi';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ManageWordPage() {
  useTitle('Quản lý từ vựng');
  const classes = useStyles();
  const [words, setWords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

  const refetchWords = async () => {
    try {
      const apiRes = await wordApi.fetchWords();
      if (apiRes.status === 200) {
        const { words = [] } = apiRes.data;
        setLoading(false);
        setWords(words);
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    refetchWords();
  }, []);

  const handleSwitch = async (id) => {
    try {
      const apiRes = await wordApi.approveWord(id);
      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: 'Đồng ý từ vựng',
            duration: 3000,
          }),
        );
        refetchWords();
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: 'error',
          message: 'Thao tác thất bại. Thử lại',
          duration: 3000,
        }),
      );
    }
  };

  return loading ? (
    <GlobalLoading />
  ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Word</TableCell>
            <TableCell>Mean</TableCell>
            <TableCell>Picture</TableCell>
            <TableCell>Phonetic</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {words.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.word}
              </TableCell>
              <TableCell>{row.mean}</TableCell>
              <TableCell>
                {row.picture ? (
                  <CardMedia
                    component="img"
                    src={row.picture}
                    alt="Contemplative Reptile"
                    height={80}
                    width={80}
                  />
                ) : null}
              </TableCell>
              <TableCell>{row.phonetic}</TableCell>
              <TableCell>
                <Switch onClick={() => handleSwitch(row._id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
