import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  useTheme,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs = [],
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      py: theme.spacing(4)
    }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: theme.spacing(3) }}
          >
            {breadcrumbs.map((crumb, index) => (
              crumb.href ? (
                <Link
                  key={index}
                  color="inherit"
                  href={crumb.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(crumb.href!);
                  }}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography
                  key={index}
                  color="text.primary"
                  sx={{ fontWeight: 500 }}
                >
                  {crumb.label}
                </Typography>
              )
            ))}
          </Breadcrumbs>
        )}

        {/* Header */}
        <Box sx={{ mb: theme.spacing(4) }}>
          <Typography 
            variant="h4" 
            component="h1" 
            color="primary" 
            fontWeight="bold" 
            gutterBottom
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Content */}
        {children}
      </Container>
    </Box>
  );
}; 