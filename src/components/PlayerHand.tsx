import React, { useState } from 'react';
import { Box, Card as MuiCard, CardContent, Typography, styled, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../types/game';

const StyledCard = styled(motion(MuiCard))(({ theme }) => ({
  width: 200,
  height: 300,
  margin: theme.spacing(1),
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

interface PlayerHandProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  isActive: boolean;
}

const cardTypeColors = {
  'initial-access': '#f44336', // Red
  'persistence': '#ff9800',    // Orange
  'privilege-escalation': '#ffeb3b', // Yellow
  'defense-evasion': '#4caf50',  // Green
  'credential-access': '#2196f3', // Blue
  'discovery': '#9c27b0',      // Purple
  'lateral-movement': '#795548', // Brown
  'execution': '#ff5722',      // Deep Orange
  'exfiltration': '#607d8b',   // Blue Grey
  'detection': '#00bcd4',      // Cyan
  'response': '#e91e63',       // Pink
  'prevention': '#9c27b0',     // Purple
};

const cardTypeDescriptions = {
  'initial-access': 'Gain initial foothold in the cloud environment',
  'persistence': 'Maintain access to the environment',
  'privilege-escalation': 'Obtain higher level permissions',
  'defense-evasion': 'Avoid detection by security controls',
  'credential-access': 'Steal or crack credentials',
  'discovery': 'Learn about the environment',
  'lateral-movement': 'Move between different parts of the cloud',
  'execution': 'Run commands or code in the environment',
  'exfiltration': 'Extract sensitive data from the environment',
  'detection': 'Identify suspicious activities',
  'response': 'React to security incidents',
  'prevention': 'Implement proactive security controls',
};

const getStrategyTips = (card: Card): string[] => {
  const tips: string[] = [];
  
  if (card.team === 'red') {
    tips.push(`Best used when you have ${card.cost} or more resources`);
    tips.push(`Success threshold of ${card.successThreshold} means you need to roll ${card.successThreshold} or higher`);
    if (card.type === 'initial-access') {
      tips.push('Try to use this early in the game to establish presence');
    } else if (card.type === 'privilege-escalation') {
      tips.push('Use this after gaining initial access to increase your capabilities');
    }
  } else {
    tips.push(`Costs ${card.cost} resources to play`);
    tips.push(`Detects activities with threshold ${card.successThreshold} or higher`);
    if (card.type === 'detection') {
      tips.push('Place this in zones you want to monitor');
    } else if (card.type === 'response') {
      tips.push('Use this to counter active threats');
    }
  }
  
  return tips;
};

const zoneImportance: Record<string, number> = {
  'Lambda': 1,
  'Cognito': 1,
  'EC2': 2,
  'RDS': 2,
  'S3': 3,
  'IAM': 3,
  // Add more zones as needed
};

export const PlayerHand: React.FC<PlayerHandProps> = ({ cards, onCardClick, isActive }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Sort cards from least to most important zone
  const sortedCards = [...cards].sort((a, b) => {
    const aImportance = a.targetZone ? zoneImportance[a.targetZone] || 0 : 0;
    const bImportance = b.targetZone ? zoneImportance[b.targetZone] || 0 : 0;
    return aImportance - bImportance;
  });

  const handleCardClick = (card: Card) => {
    if (isActive) {
      setSelectedCard(card);
    }
  };

  const handlePlayCard = () => {
    if (selectedCard) {
      onCardClick(selectedCard);
      setSelectedCard(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', opacity: isActive ? 1 : 0.6 }}>
      <AnimatePresence>
        {sortedCards.map((card) => (
          <StyledCard
            key={card.id}
            onClick={() => handleCardClick(card)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              filter: isActive ? 'none' : 'grayscale(100%)',
              cursor: isActive ? 'pointer' : 'not-allowed',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {card.name}
              </Typography>
              <Chip 
                label={card.type.replace('-', ' ').toUpperCase()} 
                size="small"
                sx={{ 
                  backgroundColor: cardTypeColors[card.type as keyof typeof cardTypeColors],
                  color: 'white',
                  mb: 1
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Cost: {card.cost}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Threshold: {card.successThreshold}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {card.effect}
              </Typography>
            </CardContent>
          </StyledCard>
        ))}
      </AnimatePresence>

      <Dialog 
        open={!!selectedCard} 
        onClose={() => setSelectedCard(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedCard && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {selectedCard.name}
                <Chip 
                  label={selectedCard.type.replace('-', ' ').toUpperCase()} 
                  size="small"
                  sx={{ 
                    backgroundColor: cardTypeColors[selectedCard.type as keyof typeof cardTypeColors],
                    color: 'white'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography paragraph>
                {cardTypeDescriptions[selectedCard.type as keyof typeof cardTypeDescriptions]}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Effect
              </Typography>
              <Typography paragraph>
                {selectedCard.effect}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  label={`Cost: ${selectedCard.cost}`}
                  variant="outlined"
                />
                <Chip 
                  label={`Threshold: ${selectedCard.successThreshold}`}
                  variant="outlined"
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                Strategy Tips
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {getStrategyTips(selectedCard).map((tip, index) => (
                  <Typography component="li" key={index} paragraph>
                    {tip}
                  </Typography>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedCard(null)}>Close</Button>
              {isActive && (
                <Button 
                  onClick={handlePlayCard}
                  variant="contained"
                  color={selectedCard.team === 'red' ? 'error' : 'primary'}
                >
                  Play Card
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}; 