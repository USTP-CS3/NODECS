import {
	Heading,
	Container,
	Switch,
	Input,
	FormControl,
	FormLabel,
	Textarea,
	Button,
	Flex,
	Box,
	Text,
	Stack,
	IconButton,
	HStack,
	Badge,
	Select,
  } from '@chakra-ui/react';
  
  import { ArrowForwardIcon, SettingsIcon, HamburgerIcon, CalendarIcon } from '@chakra-ui/icons';
  
  export default function App() {
	return (
	  <>
		<Container maxW="container.xl" paddingY={70}>
		  <Heading marginBottom={50}>
			Integrated Announcement System{' '}
			<Badge backgroundColor={'yellow.500'} color={'white'} paddingX={3} paddingY={1} ml={2}>
			  BETA
			</Badge>
		  </Heading>
		  <Flex direction={['column', 'column', 'row']}>
			<Box flex={['1', '1', '0.5']} minWidth={['100%', '100%', '180px']} mb={[10, 10, 0]}>
			  <FormControl>
				<Stack spacing={3}>
				  <FormLabel htmlFor="toggle1" display="flex" justifyContent="space-between" alignItems="center">
					<Text fontSize={'xl'}>Messenger</Text>
					<Switch id="toggle1" size={'lg'} />
				  </FormLabel>
				  <FormLabel htmlFor="toggle2" display="flex" justifyContent="space-between" alignItems="center">
					<Text fontSize={'xl'}>Discord</Text>
					<Switch id="toggle2" size={'lg'} />
				  </FormLabel>
				  <FormLabel htmlFor="toggle3" display="flex" justifyContent="space-between" alignItems="center">
					<Text fontSize={'xl'}>Email</Text>
					<Switch id="toggle3" size={'lg'} />
				  </FormLabel>
				  <FormLabel htmlFor="toggle3" display="flex" justifyContent="space-between" alignItems="center">
					<Text fontSize={'xl'}>SMS</Text>
					<Switch id="toggle3" size={'lg'} disabled />
				  </FormLabel>
				  <HStack spacing={2} mt={5}>
				  	<IconButton aria-label="Search database" icon={<HamburgerIcon />} />
					<IconButton aria-label="Search database" icon={<SettingsIcon />} />
					<IconButton aria-label="Search database" icon={<CalendarIcon />} />
				  </HStack>
				</Stack>
			  </FormControl>
			</Box>
  
			<Box flex={['1', '1', '2']} paddingLeft={['0', '0', '100px']}>
			  <Stack spacing={3}>
				<Input placeholder="Title" size="lg" fontWeight={500} required={true}/>
				<Textarea placeholder="What's on your mind?" minHeight={160} required={true}/>
  
				<HStack spacing={2}>
					<Select>
						<option value="option1">Everyone</option>
						<option value="option2">Core Team</option>
						<option value="option3">Cube Org.</option>
						<option value="option3">1st Yr Students</option>
						<option value="option3">2nd Yr Students</option>
					</Select>
					<Button
						rightIcon={<ArrowForwardIcon />}
						colorScheme="teal"
						variant="solid"
					>
						Submit
					</Button>
				</HStack>

			  </Stack>
			</Box>
		  </Flex>
		</Container>
	  </>
	);
  }
