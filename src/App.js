import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage'
import ResetPassword from './views/ResetPassword'
import NotFound from './views/NotFound';
import RegisterPage from './views/RegisterPage';
import ExpenseReportPage from './views/ExpenseReportPage';
import ProjectPage from './views/ProjectPage';
import ProjectList from './views/ProjectList';
import ApproverProjectList from './views/Approver/ApproverProjectList';
import ApproverPage from './views/Approver/ApproverPage';
import AdminDashboard from './views/Admin/AdminDashboard';
import AdminProjectList from './views/Admin/AdminProjectList';
import ProjectView from './views/Admin/ProjectView';
import PrivateRoute from './views/PrivateRoute';
import MyProfile from './views/MyProfile';
import { useSelector } from 'react-redux';
import ListAllUsers from './views/Admin/ListAllUsers';
import CreateProfitPage from './views/CreateProfitPage';
import ListUserProfit from './views/ListUserProfit';
import FundReceivedList from './views/Admin/FundReceivedList';
import FundReceviedView from './views/Admin/FundReceviedView';
import SubProjectList from './views/Admin/SubProjectList';

const App = () => {
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });
  const loginData = useSelector((state) => state.auth.user);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path='*' element={<NotFound />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/register"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <RegisterPage /> :
                <NotFound />}
            </PrivateRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
              <MyProfile /> : <NotFound/>
              }
            </PrivateRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <PrivateRoute>
              <ExpenseReportPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/project"
          element={
            <PrivateRoute>
              <ProjectPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projectlist"
          element={
            <PrivateRoute>
              <ProjectList />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-profit"
          element={
            <PrivateRoute>
              <CreateProfitPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-profit-list"
          element={
            <PrivateRoute>
              <ListUserProfit />
            </PrivateRoute>
          }
        />
        <Route
          path="/approver"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'APPROVER' ? 
              <ApproverProjectList /> :
              <NotFound /> }
            </PrivateRoute>
          }
        />
        <Route
          path="/approver-page"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'APPROVER' ?
                <ApproverPage /> :
                <NotFound />
              }
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <AdminDashboard /> :
                <NotFound />}
            </PrivateRoute>
          }
        />
        <Route
          path="/fund-received"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <FundReceivedList /> :
                <NotFound />}
            </PrivateRoute>
          }
        />
        <Route
          path="/fund-List"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <FundReceviedView /> :
                <NotFound />}
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-projectlist"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <AdminProjectList /> :
                <NotFound />
              }
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-project-view"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <ProjectView /> :
                <NotFound />}
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <ListAllUsers /> :
                <NotFound />}
            </PrivateRoute>
          }
        />

        <Route
          path="/sub-project-list"
          element={
            <PrivateRoute>
              {loginData && loginData.roles[0]?.authority === 'ADMIN' ?
                <SubProjectList /> :
                <NotFound />}
            </PrivateRoute>
          }
        />
        
      </Routes>
    </Router>
  )
}

export default App


