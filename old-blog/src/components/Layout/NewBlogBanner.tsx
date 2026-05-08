import { useEffect, useState } from "react";
import { Box, Flex, CloseButton, Link, Text } from "@chakra-ui/react";

const STORAGE_KEY = "new-blog-banner-dismissed";

export function NewBlogBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (localStorage.getItem(STORAGE_KEY) !== "1") {
			setVisible(true);
		}
	}, []);

	if (!visible) return null;

	const dismiss = () => {
		localStorage.setItem(STORAGE_KEY, "1");
		setVisible(false);
	};

	return (
		<Box
			position="relative"
			color="white"
			px={4}
			py={2.5}
			bgGradient="linear(to-r, #4338ca, #3730a3, #4338ca)"
			borderBottom="1px solid"
			borderColor="whiteAlpha.200"
			overflow="hidden"
		>
			<Box
				position="absolute"
				inset="0"
				pointerEvents="none"
				bgGradient="radial(ellipse at top left, rgba(216,180,254,0.4), transparent 60%), radial(ellipse at bottom right, rgba(233,213,255,0.3), transparent 60%)"
			/>
			<Flex
				align="center"
				justify="center"
				gap={3}
				maxW="1200px"
				mx="auto"
				position="relative"
			>
				<Text fontSize="sm" textAlign="center" flex="1" letterSpacing="tight">
					Fresh blog, same me.{" "}
					<Link
						href="/"
						fontWeight="semibold"
						color="#c7d2fe"
						_hover={{ color: "white", textDecoration: "underline" }}
					>
						Visit the new blog &rarr;
					</Link>
				</Text>
				<CloseButton
					size="sm"
					onClick={dismiss}
					aria-label="Dismiss banner"
					color="whiteAlpha.800"
					_hover={{ bg: "whiteAlpha.200", color: "white" }}
				/>
			</Flex>
		</Box>
	);
}
