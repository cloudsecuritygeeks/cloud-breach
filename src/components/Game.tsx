import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText, useTheme, Divider } from '@mui/material';
import { GameBoard } from './GameBoard';
import { PlayerHand } from './PlayerHand';
import { Dice } from './Dice';
import { useGameStore } from '../store/gameStore';
import { Card, Player } from '../types/game';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CasinoIcon from '@mui/icons-material/Casino';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ShieldIcon from '@mui/icons-material/Shield';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled } from '@mui/material/styles';

const initialCards: Card[] = [
  // Red Team Cards (AWS)
  {
    id: '1',
    name: 'EC2 Password Data Theft',
    type: 'credential-access',
    cost: 3,
    effect: 'Retrieve EC2 instance password data from Windows instances',
    successThreshold: 4,
    team: 'red',
    targetZone: 'EC2',
  },
  {
    id: '2',
    name: 'Secrets Manager Batch Retrieval',
    type: 'credential-access',
    cost: 4,
    effect: 'Retrieve multiple Secrets Manager secrets in batch',
    successThreshold: 5,
    team: 'red',
    targetZone: 'Secrets',
  },
  {
    id: '3',
    name: 'CloudTrail Deletion',
    type: 'defense-evasion',
    cost: 5,
    effect: 'Delete CloudTrail trail to evade detection',
    successThreshold: 6,
    team: 'red',
    targetZone: 'Logging',
  },
  {
    id: '4',
    name: 'S3 Lifecycle Impairment',
    type: 'defense-evasion',
    cost: 4,
    effect: 'Impair CloudTrail logs through S3 lifecycle rules',
    successThreshold: 5,
    team: 'red',
    targetZone: 'S3',
  },
  {
    id: '5',
    name: 'DNS Query Logs Deletion',
    type: 'defense-evasion',
    cost: 3,
    effect: 'Delete DNS query logs to hide C2 traffic',
    successThreshold: 4,
    team: 'red',
    targetZone: 'DNS',
  },
  {
    id: '6',
    name: 'Organization Escape',
    type: 'privilege-escalation',
    cost: 5,
    effect: 'Attempt to leave the AWS Organization',
    successThreshold: 6,
    team: 'red',
    targetZone: 'Organization',
  },
  {
    id: '7',
    name: 'EC2 User Data Execution',
    type: 'execution',
    cost: 4,
    effect: 'Execute commands via EC2 instance user data',
    successThreshold: 5,
    team: 'red',
    targetZone: 'EC2',
  },
  {
    id: '8',
    name: 'SSM Command Execution',
    type: 'execution',
    cost: 4,
    effect: 'Execute commands on multiple instances via SSM',
    successThreshold: 5,
    team: 'red',
    targetZone: 'SSM',
  },
  {
    id: '9',
    name: 'Security Group Backdoor',
    type: 'persistence',
    cost: 3,
    effect: 'Open ingress port 22 on a security group',
    successThreshold: 4,
    team: 'red',
    targetZone: 'Network',
  },
  {
    id: '10',
    name: 'S3 Ransomware Attack',
    type: 'impact',
    cost: 5,
    effect: 'Encrypt S3 contents with client-side encryption',
    successThreshold: 6,
    team: 'red',
    targetZone: 'S3',
  },

  // Blue Team Cards
  {
    id: '11',
    name: 'GuardDuty Enhancement',
    type: 'detection',
    cost: 3,
    effect: 'Enable advanced threat detection across services',
    successThreshold: 4,
    team: 'blue',
    targetZone: 'Security',
  },
  {
    id: '12',
    name: 'CloudTrail Immutability',
    type: 'prevention',
    cost: 4,
    effect: 'Enable immutable logging with KMS encryption',
    successThreshold: 5,
    team: 'blue',
    targetZone: 'Logging',
  },
  {
    id: '13',
    name: 'IAM Access Analyzer',
    type: 'detection',
    cost: 3,
    effect: 'Detect unintended resource sharing',
    successThreshold: 4,
    team: 'blue',
    targetZone: 'IAM',
  },
  {
    id: '14',
    name: 'Organization SCP',
    type: 'prevention',
    cost: 4,
    effect: 'Implement restrictive Service Control Policies',
    successThreshold: 5,
    team: 'blue',
    targetZone: 'Organization',
  },
  {
    id: '15',
    name: 'SSM Session Monitoring',
    type: 'detection',
    cost: 3,
    effect: 'Enable session logging and monitoring',
    successThreshold: 4,
    team: 'blue',
    targetZone: 'SSM',
  },
  {
    id: '16',
    name: 'S3 Versioning',
    type: 'prevention',
    cost: 3,
    effect: 'Enable versioning and MFA delete',
    successThreshold: 4,
    team: 'blue',
    targetZone: 'S3',
  },
  {
    id: '17',
    name: 'EC2 Instance Connect',
    type: 'prevention',
    cost: 3,
    effect: 'Replace SSH with Instance Connect',
    successThreshold: 4,
    team: 'blue',
    targetZone: 'EC2',
  },
  {
    id: '18',
    name: 'DNS Firewall',
    type: 'prevention',
    cost: 3,
    effect: 'Implement DNS filtering rules',
    successThreshold: 4,
    team: 'blue',
    targetZone: 'DNS',
  },
  {
    id: '19',
    name: 'Secrets Manager Rotation',
    type: 'prevention',
    cost: 4,
    effect: 'Enable automatic secret rotation',
    successThreshold: 5,
    team: 'blue',
    targetZone: 'Secrets',
  },
  {
    id: '20',
    name: 'Security Hub Controls',
    type: 'detection',
    cost: 4,
    effect: 'Enable Security Hub foundational controls',
    successThreshold: 5,
    team: 'blue',
    targetZone: 'Security',
  },
];

const SpyAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
}));

const SpyPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(45deg, #263238 30%, #37474f 90%)',
  color: '#fff',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
}));

const SpyButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 90%)',
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
  },
}));

const BlueSpyButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #0d47a1 30%, #1565c0 90%)',
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
  },
}));

const Watermark = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.08,
  background: 'none',
}));

const AppBarLogo = styled('img')(() => ({
  height: 40,
  width: 40,
  marginRight: 12,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
}));

export const Game: React.FC = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const theme = useTheme();
  const { 
    players,
    currentTurn,
    activePlayer,
    gamePhase,
    gameStatus,
    initializePlayers, 
    handleZoneClick, 
    handleCardPlay, 
    handleResourceRoll,
    handleNextPhase,
    redScore,
    blueScore,
    redLog,
    blueLog
  } = useGameStore();

  const activePlayerData = players.find(p => p.id === activePlayer);

  const handleRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(roll);
      setIsRolling(false);
      handleResourceRoll(roll);
    }, 1000);
  };

  const handleCardClick = (card: Card) => {
    if (gamePhase === 'action' && activePlayer === card.team) {
      handleCardPlay(card);
    }
  };

  const renderHelpContent = () => (
    <DialogContent sx={{ bgcolor: '#263238', color: '#fff' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
        Mission Briefing: Cloud Breach
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, color: '#fff' }}>
        Mission Overview
      </Typography>
      <Typography paragraph sx={{ color: '#fff' }}>
        In this high-stakes cyber espionage mission, Red Team (attackers) attempts to breach critical systems while Blue Team (defenders) works to protect sensitive data.
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ color: '#fff' }}>
        Mission Phases
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <CasinoIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Resource Acquisition" 
            secondary="Roll the dice to gather intelligence resources. Blue Team receives additional classified intel (+2)."
            secondaryTypographyProps={{ color: '#b0bec5' }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CardGiftcardIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Covert Operations" 
            secondary="Execute strategic moves and deploy specialized tools. Each agent can perform up to 2 operations."
            secondaryTypographyProps={{ color: '#b0bec5' }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ShieldIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Counter-Intelligence" 
            secondary="Blue Team deploys defensive measures while Red Team establishes persistence."
            secondaryTypographyProps={{ color: '#b0bec5' }}
          />
        </ListItem>
      </List>

      <Typography variant="subtitle1" gutterBottom sx={{ color: '#fff' }}>
        Mission Protocol
      </Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="1. Gather Intelligence" 
            secondary="Click 'Roll for Resources' to acquire operational resources."
            secondaryTypographyProps={{ color: '#b0bec5' }}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Execute Operations" 
            secondary="Navigate through security zones and deploy specialized tools from your arsenal."
            secondaryTypographyProps={{ color: '#b0bec5' }}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Mission Complete" 
            secondary="Phase concludes automatically after counter-intelligence operations."
            secondaryTypographyProps={{ color: '#b0bec5' }}
          />
        </ListItem>
      </List>

      <Typography variant="subtitle1" gutterBottom sx={{ color: '#fff' }}>
        Mission Objectives
      </Typography>
      <Typography paragraph sx={{ color: '#fff' }}>
        Red Team: Successfully breach 3 critical systems (marked with red borders).
        Blue Team: Prevent breaches for 10 rounds or neutralize 3 attackers.
      </Typography>
    </DialogContent>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: gameStatus === 'playing'
          ? 'linear-gradient(45deg, #1a1a1a 30%, #23272f 90%)'
          : '#1a1a1a',
        background: gameStatus === 'playing'
          ? 'linear-gradient(45deg, #1a1a1a 30%, #23272f 90%)'
          : '#1a1a1a',
      }}
    >
      {/* Watermark background only before game starts */}
      {gameStatus !== 'playing' && (
        <Watermark>
          <img src={'/assets/spy-vs-spy.png'} alt="Spy vs Spy" style={{ maxWidth: '60vw', maxHeight: '80vh', objectFit: 'contain' }} />
        </Watermark>
      )}
      <SpyAppBar position="static" sx={{ zIndex: 2 }}>
        <Toolbar>
          <AppBarLogo src={'/assets/spy-vs-spy.png'} alt="Spy vs Spy Logo" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon /> Cloud Breach
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`Mission ${currentTurn}`}
              color="primary"
              variant="outlined"
              sx={{ color: '#fff', borderColor: '#fff' }}
            />
            <Chip 
              label={gamePhase.replace('-', ' ').toUpperCase()}
              color="secondary"
              variant="outlined"
              sx={{ color: '#fff', borderColor: '#fff' }}
            />
            <Button 
              color="inherit" 
              startIcon={<HelpOutlineIcon />}
              onClick={() => setShowHelp(true)}
            >
              Mission Briefing
            </Button>
          </Box>
        </Toolbar>
      </SpyAppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {gameStatus === 'playing' && (
          <SpyPaper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: activePlayer === 'red' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(33, 150, 243, 0.1)',
              border: '2px solid',
              borderColor: activePlayer === 'red' ? '#f44336' : '#2196f3',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" component="div" sx={{ color: '#fff' }}>
                  {activePlayer === 'red' ? 'Red Agent' : 'Blue Agent'} Active
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Resources: {activePlayerData?.resources || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  Phase: {gamePhase.replace('-', ' ').toUpperCase()}
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  Position: {activePlayerData?.position || 'Not set'}
                </Typography>
              </Box>
            </Box>
          </SpyPaper>
        )}

        {/* New horizontal layout for hands and board */}
        {gameStatus === 'playing' && (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 4, mt: 4 }}>
            {/* Red Team Hand */}
            <Box sx={{ flex: 1, minWidth: 260 }}>
              <Typography 
                variant="h6" 
                sx={{ mb: 1, color: '#f44336', textAlign: 'center' }}
              >
                Red Agent
                {activePlayer === 'red' && (
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#fff', textAlign: 'center', mb: 1 }}>
                Score: {redScore}
              </Typography>
              <PlayerHand
                cards={players.find(p => p.team === 'red')?.cards || []}
                onCardClick={handleCardClick}
                isActive={activePlayer === 'red' && gamePhase === 'action'}
              />
              <Divider sx={{ my: 2, bgcolor: '#f44336', opacity: 0.3 }} />
              {/* Red Log */}
              <Paper elevation={2} sx={{ p: 1, bgcolor: '#2d2323', color: '#fff', maxHeight: 180, overflowY: 'auto' }}>
                <Typography variant="subtitle2" sx={{ color: '#f44336', mb: 1 }}>
                  Red Log
                </Typography>
                <List dense>
                  {[...redLog].reverse().map((entry, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText primary={entry} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>

            {/* Game Board Centered */}
            <Box sx={{ flex: 2, minWidth: 400 }}>
              <GameBoard 
                onZoneClick={handleZoneClick} 
                activePlayer={activePlayer}
              />
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                {gamePhase === 'resource-collection' ? (
                  <>
                    <SpyButton 
                      variant="contained" 
                      onClick={handleRoll}
                      disabled={isRolling}
                      size="large"
                      startIcon={<CasinoIcon />}
                    >
                      Gather Intelligence
                    </SpyButton>
                    <Dice value={diceValue} isRolling={isRolling} />
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNextPhase}
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: activePlayer === 'red' ? '#f44336' : '#2196f3',
                      color: 'white',
                      '&:hover': {
                        bgcolor: activePlayer === 'red' ? '#d32f2f' : '#1976d2',
                      },
                    }}
                  >
                    Next Phase
                  </Button>
                )}
              </Box>
            </Box>

            {/* Blue Team Hand */}
            <Box sx={{ flex: 1, minWidth: 260 }}>
              <Typography 
                variant="h6" 
                sx={{ mb: 1, color: '#2196f3', textAlign: 'center' }}
              >
                Blue Agent
                {activePlayer === 'blue' && (
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#fff', textAlign: 'center', mb: 1 }}>
                Score: {blueScore}
              </Typography>
              <PlayerHand
                cards={players.find(p => p.team === 'blue')?.cards || []}
                onCardClick={handleCardClick}
                isActive={activePlayer === 'blue' && gamePhase === 'action'}
              />
              <Divider sx={{ my: 2, bgcolor: '#2196f3', opacity: 0.3 }} />
              {/* Blue Log */}
              <Paper elevation={2} sx={{ p: 1, bgcolor: '#23283a', color: '#fff', maxHeight: 180, overflowY: 'auto' }}>
                <Typography variant="subtitle2" sx={{ color: '#2196f3', mb: 1 }}>
                  Blue Log
                </Typography>
                <List dense>
                  {[...blueLog].reverse().map((entry, idx) => (
                    <ListItem key={idx} disablePadding>
                      <ListItemText primary={entry} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>
        )}

        {gameStatus === 'setup' && (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
              Welcome to Cloud Breach
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
              A high-stakes cyber espionage mission where Red Team infiltrates and Blue Team defends.
              <br />
              Agents take turns on the same device, perfect for classified briefings.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <SpyButton 
                variant="contained" 
                onClick={() => initializePlayers(initialCards)}
                size="large"
                startIcon={<BugReportIcon />}
              >
                Begin Mission
              </SpyButton>
              <BlueSpyButton
                variant="outlined"
                onClick={() => setShowHelp(true)}
                size="large"
                startIcon={<HelpOutlineIcon />}
              >
                Mission Briefing
              </BlueSpyButton>
            </Box>
          </Box>
        )}
      </Container>

      <Dialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#263238',
            color: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>
          Mission Briefing
        </DialogTitle>
        {renderHelpContent()}
        <DialogActions>
          <Button onClick={() => setShowHelp(false)} sx={{ color: '#fff' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 