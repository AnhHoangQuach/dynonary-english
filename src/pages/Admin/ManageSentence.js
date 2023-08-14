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
import { Switch } from '@material-ui/core';
import useTitle from 'hooks/useTitle';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import sentenceApi from 'apis/sentenceApi';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ManageSentencePage() {
  useTitle('Quản lý ngữ pháp');
  const classes = useStyles();
  const [sentences, setSentences] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

  const handleSwitch = async (id) => {
    try {
      const apiRes = await sentenceApi.approveSentence(id);
      if (apiRes.status === 200) {
        dispatch(
          setMessage({
            type: 'success',
            message: 'Đồng ý mẫu câu',
            duration: 3000,
          }),
        );
        refetchSentences();
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

  const refetchSentences = async () => {
    try {
      const apiRes = await sentenceApi.fetchSentences();
      if (apiRes.status === 200) {
        const { sentences = [] } = apiRes.data;
        setLoading(false);
        setSentences(sentences);
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    refetchSentences();
  }, []);

  return loading ? (
    <GlobalLoading />
  ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Sentence</TableCell>
            <TableCell>Mean</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sentences.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.sentence}
              </TableCell>
              <TableCell>{row.mean}</TableCell>
              <TableCell>
                <Switch
                  onClick={() => handleSwitch(row._id)}
                  checked={row.isChecked}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
