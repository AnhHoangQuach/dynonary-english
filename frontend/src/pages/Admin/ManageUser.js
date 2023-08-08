import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import accountApi from 'apis/accountApi';
import GlobalLoading from 'components/UI/GlobalLoading';
import { CardMedia, Switch } from '@material-ui/core';
import { formatDate } from 'helper';
import useTitle from 'hooks/useTitle';
import { useDispatch } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ManageUserPage() {
  useTitle('Quản lý người dùng');
  const classes = useStyles();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

  const handleSwitch = async (id, isActive) => {
    try {
      if (isActive) {
        const apiRes = await accountApi.deactivateUser(id);
        if (apiRes.status === 200) {
          dispatch(
            setMessage({
              type: 'success',
              message: 'Đã vô hiệu hóa tài khoản',
              duration: 3000,
            }),
          );
          refetchUsers();
        }
      } else {
        const apiRes = await accountApi.activeUser(id);
        if (apiRes.status === 200) {
          dispatch(
            setMessage({
              type: 'success',
              message: 'Đã kích hoạt tài khoản',
              duration: 3000,
            }),
          );
          refetchUsers();
        }
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

  const refetchUsers = async () => {
    try {
      const apiRes = await accountApi.fetchUsers();
      if (apiRes.status === 200) {
        const { users = [] } = apiRes.data;
        setLoading(false);
        setUsers(users);
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    refetchUsers();
  }, []);

  return loading ? (
    <GlobalLoading />
  ) : (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Avatar</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Created Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell>
                {row.avt ? (
                  <CardMedia
                    component="img"
                    src={row.avt}
                    alt="Contemplative Reptile"
                    height={80}
                    width={80}
                  />
                ) : null}
              </TableCell>
              <TableCell>{row.accountId.email}</TableCell>
              <TableCell>
                <Switch
                  checked={row.accountId.isActive}
                  onClick={() =>
                    handleSwitch(row.accountId._id, row.accountId.isActive)
                  }
                />
              </TableCell>
              <TableCell>{formatDate(row.accountId.createdDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
