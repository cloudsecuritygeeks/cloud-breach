import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Zone } from '../types/game';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import DnsIcon from '@mui/icons-material/Dns';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ComputerIcon from '@mui/icons-material/Computer';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsSystemDaydreamIcon from '@mui/icons-material/SettingsSystemDaydream';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const ZoneBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(45deg, #263238 30%, #37474f 90%)',
  color: '#fff',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
}));

interface GameBoardProps {
  onZoneClick: (zoneId: Zone) => void;
  activePlayer: string;
}

const zones: { id: Zone; name: string; icon: React.ReactNode; description: string }[] = [
  { id: 'EC2', name: 'EC2 Instances', icon: <ComputerIcon />, description: 'Compute resources vulnerable to password theft and user data attacks' },
  { id: 'S3', name: 'S3 Storage', icon: <StorageIcon />, description: 'Object storage susceptible to ransomware and lifecycle manipulation' },
  { id: 'IAM', name: 'Identity & Access', icon: <VpnKeyIcon />, description: 'Access control and permissions management' },
  { id: 'Secrets', name: 'Secrets Manager', icon: <SecurityIcon />, description: 'Sensitive credentials and configuration storage' },
  { id: 'Logging', name: 'Logging Services', icon: <ListAltIcon />, description: 'CloudTrail and audit logging infrastructure' },
  { id: 'DNS', name: 'DNS Services', icon: <DnsIcon />, description: 'DNS query logging and filtering' },
  { id: 'Organization', name: 'AWS Organization', icon: <AccountTreeIcon />, description: 'Multi-account management and policies' },
  { id: 'Network', name: 'Network Security', icon: <NetworkCheckIcon />, description: 'Security groups and network controls' },
  { id: 'SSM', name: 'Systems Manager', icon: <SettingsSystemDaydreamIcon />, description: 'Remote management and automation' },
  { id: 'Security', name: 'Security Services', icon: <AdminPanelSettingsIcon />, description: 'GuardDuty and Security Hub' },
];

export const GameBoard: React.FC<GameBoardProps> = ({ onZoneClick, activePlayer }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
        Cloud Infrastructure
      </Typography>
      <Grid container spacing={2}>
        {zones.map((zone) => (
          <Grid key={zone.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
            <ZoneBox
              onClick={() => onZoneClick(zone.id)}
              sx={{
                border: '1px solid',
                borderColor: theme => 
                  zone.id === 'EC2' || zone.id === 'S3' || zone.id === 'IAM'
                    ? '#f44336'  // Critical zones in red
                    : '#2196f3', // Standard zones in blue
              }}
            >
              <Box sx={{ mb: 1 }}>{zone.icon}</Box>
              <Typography variant="subtitle1" align="center">
                {zone.name}
              </Typography>
              <Typography variant="caption" align="center" sx={{ opacity: 0.7 }}>
                {zone.description}
              </Typography>
            </ZoneBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 