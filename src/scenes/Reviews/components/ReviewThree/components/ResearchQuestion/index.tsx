import { Box, Grid, Typography } from '@mui/joy';
import { motion } from 'framer-motion';
import { FC } from 'react';

const questions = [
	'Which specific investments or campaigns by the Korean Red Cross have the greatest impact on increasing the national blood donation supply?',
	'How do regional efforts by local branches of the Korean Red Cross influence the blood donation supply in their respective regions?',
];

const ResearchQuestion: FC<{ p: number }> = ({ p }) => {
	return (
		<Box p={p}>
			<Box p={p / 2} />
			<Grid container spacing={18}>
				{questions.map((q, i) => (
					<Grid xs={6} key={`q-${i}`}>
						<div>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								<Typography level="body-lg">RQ{i}.</Typography>
								<Box p={1} />
								<Typography level="h2">{q}</Typography>
							</motion.div>
						</div>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default ResearchQuestion;
