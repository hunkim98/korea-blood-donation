import { Box, Divider, Typography, useTheme } from '@mui/joy';
import { FC } from 'react';

const Hero: FC<{ p: number }> = ({ p }) => {
	const { palette } = useTheme();

	return (
		<div>
			<Box
				sx={{
					display: 'flex',
					gap: 4,
				}}
			>
				<Divider orientation="vertical" />
				<Box p={p / 2}>
					<Typography
						sx={{
							fontSize: '3rem',
							fontFamily: 'Noto Sans KR',
							fontWeight: 500,
							color: palette.neutral[400],
						}}
					>
						피
					</Typography>
				</Box>
				<Divider orientation="vertical" />
				<Box p={p / 2}>
					<Typography
						sx={{
							fontSize: '3rem',
							fontFamily: 'Noto Sans KR',
							fontWeight: 500,
							color: palette.neutral[400],
						}}
					>
						물
					</Typography>
				</Box>
				<Divider orientation="vertical" />
				<Box sx={{ flex: 1, paddingTop: p / 2 + 1.5, paddingLeft: 2 }}>
					<Typography level="title-lg" sx={{ color: 'text.tertiary' }}>
						Hun Kim
					</Typography>
					<Typography level="title-lg" sx={{ color: 'text.tertiary' }}>
						Morgan Doane
					</Typography>
				</Box>
				<Divider orientation="vertical" />
			</Box>
			<Divider />
			<Box p={p}>
				<Box p={p} />
				<Typography
					level="h1"
					sx={{
						whiteSpace: 'pre-line',
						fontSize: '4rem',
					}}
				>
					{`How have Red Cross policy initiatives
					affected blood supply in Korea?`}
				</Typography>
				<Box p={1} />
				<Box
					sx={{
						height: '8px',
						width: '72px',
						background: palette.primary[500],
					}}
				/>
			</Box>
		</div>
	);
};

export default Hero;
