import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceProps {
  value: number;
  isRolling: boolean;
}

const diceVariants = {
  initial: { rotateX: 0, rotateY: 0 },
  rolling: {
    rotateX: [0, 360, 720, 1080],
    rotateY: [0, 360, 720, 1080],
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};

const dotVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 },
};

const getDots = (value: number): React.ReactElement[] => {
  const dots: React.ReactElement[] = [];
  const positions = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [25, 75], [75, 25], [75, 75]],
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
    6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
  };

  const dotPositions = positions[value as keyof typeof positions] || positions[1];

  dotPositions.forEach(([x, y], index) => {
    dots.push(
      <motion.div
        key={index}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          width: '20%',
          height: '20%',
          borderRadius: '50%',
          backgroundColor: 'white',
        }}
      />
    );
  });

  return dots;
};

export const Dice: React.FC<DiceProps> = ({ value, isRolling }) => {
  return (
    <Box
      sx={{
        width: 100,
        height: 100,
        position: 'relative',
        perspective: '1000px',
      }}
    >
      <motion.div
        variants={diceVariants}
        initial="initial"
        animate={isRolling ? "rolling" : "initial"}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f44336',
            borderRadius: '10%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          <AnimatePresence>
            {!isRolling && getDots(value)}
          </AnimatePresence>
          {isRolling && (
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              ?
            </Typography>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}; 