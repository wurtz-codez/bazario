import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Chip,
  Paper,
  Avatar,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WebIcon from '@mui/icons-material/Web';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AuthContext from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { getPreviewUrl } from '../utils/domainPreview';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedItem from '../components/AnimatedItem';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [websites, setWebsites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user?.token) {
        try {
          const api = authAPI(user.token);
          const [websitesRes, ordersRes, analyticsRes] = await Promise.all([
            api.get('/api/websites'),
            api.get('/api/orders'),
            api.get('/api/analytics'),
          ]);

          setWebsites(websitesRes.data);
          setOrders(ordersRes.data);
          setAnalytics(analyticsRes.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Calculate total stats
  const totalWebsites = websites.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Get recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <AnimatedPage>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <AnimatedItem>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/templates"
          >
            Create Website
          </Button>
        </AnimatedItem>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Website Stats */}
        <Grid item xs={12} sm={4}>
          <AnimatedItem delay={0.1} hover>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Websites
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WebIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h4" component="div">
                    {totalWebsites}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/websites">
                  View All
                </Button>
              </CardActions>
            </Card>
          </AnimatedItem>
        </Grid>

        {/* Order Stats */}
        <Grid item xs={12} sm={4}>
          <AnimatedItem delay={0.2} hover>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Orders
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h4" component="div">
                    {totalOrders}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/orders">
                  View All
                </Button>
              </CardActions>
            </Card>
          </AnimatedItem>
        </Grid>

        {/* Revenue Stats */}
        <Grid item xs={12} sm={4}>
          <AnimatedItem delay={0.3} hover>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4" component="div">
                  ${totalRevenue.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/analytics">
                  View Analytics
                </Button>
              </CardActions>
            </Card>
          </AnimatedItem>
        </Grid>
      </Grid>

      {/* My Websites */}
      <Typography variant="h5" component="h2" gutterBottom>
        My Websites
      </Typography>

      {websites.length > 0 ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {websites.map((website, index) => (
            <Grid item xs={12} sm={6} md={4} key={website._id}>
              <AnimatedItem delay={0.4 + (index * 0.1)} hover>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {website.name}
                    </Typography>
                    <Typography color="textSecondary" sx={{ mb: 1 }}>
                      {website.domain}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {website.description}
                    </Typography>
                    <Chip 
                      label={website.template.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }} 
                    />
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/websites/${website._id}`}
                    >
                      Details
                    </Button>
                    <Button
                      size="small"
                      component="a"
                      href={getPreviewUrl(website.domain)}
                      target="_blank"
                      startIcon={<VisibilityIcon />}
                    >
                      Preview
                    </Button>
                  </CardActions>
                </Card>
              </AnimatedItem>
            </Grid>
          ))}
        </Grid>
      ) : (
        <AnimatedItem delay={0.4}>
          <Card sx={{ mb: 4, p: 2, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                No websites yet
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                Create your first website to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to="/templates"
              >
                Create Website
              </Button>
            </CardContent>
          </Card>
        </AnimatedItem>
      )}

      {/* Recent Orders */}
      <Typography variant="h5" component="h2" gutterBottom>
        Recent Orders
      </Typography>

      {recentOrders.length > 0 ? (
        <Grid container spacing={3}>
          {recentOrders.map((order) => (
            <Grid item xs={12} sm={6} key={order._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Order #{order._id.slice(-6)}
                  </Typography>
                  <Typography color="textSecondary">
                    Customer: {order.customer.name}
                  </Typography>
                  <Typography variant="body2">
                    Amount: ${order.totalAmount.toFixed(2)}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={order.status}
                      color={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'cancelled'
                          ? 'error'
                          : 'primary'
                      }
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/orders/${order._id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            No orders have been placed yet.
          </Typography>
        </Box>
      )}
    </AnimatedPage>
  );
};

export default Dashboard;