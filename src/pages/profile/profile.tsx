import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { updateUser } from '../../services/userSlice';
import { Outlet } from 'react-router-dom';
export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const updateUserError = useSelector((state) => state.user.error);
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
      setEditMode({
        name: false,
        email: false,
        password: false
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
    setEditMode({
      name: false,
      email: false,
      password: false
    });
  };
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
      setEditMode({
        name: false,
        email: false,
        password: false
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditClick = (field: 'name' | 'email' | 'password') => {
    setEditMode((prevState) => ({
      ...prevState,
      [field]: true
    }));
  };
  if (!user) return null;

  return (
    <>
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        editMode={editMode}
        handleEditClick={handleEditClick}
        updateUserError={updateUserError || undefined}
      />
      <Outlet />
    </>
  );
};
