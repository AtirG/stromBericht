"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Link,
    Paper,
    useTheme,
    alpha
} from '@mui/material';
import {
    FiberManualRecord as DotIcon
} from '@mui/icons-material';

const NewsTicker = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news');
                const data = await response.json();

                if (!data.feeds) return;

                const parser = new DOMParser();
                let allItems = [];

                data.feeds.forEach(xmlText => {
                    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                    const items = Array.from(xmlDoc.querySelectorAll("item")).map(item => ({
                        title: item.querySelector("title")?.textContent,
                        link: item.querySelector("link")?.textContent,
                        pubDate: item.querySelector("pubDate")?.textContent,
                        source: item.querySelector("source")?.textContent
                    }));
                    allItems = [...allItems, ...items];
                });

                const seenLinks = new Set();
                const uniqueItems = allItems.filter(item => {
                    if (seenLinks.has(item.link)) return false;
                    seenLinks.add(item.link);
                    return true;
                });

                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

                const filteredItems = uniqueItems
                    .filter(item => {
                        const pubDate = new Date(item.pubDate);
                        return pubDate >= twoWeeksAgo;
                    })
                    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

                setNews(filteredItems);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = String(date.getFullYear()).slice(-2);
        return `${d}.${m}.${y}`;
    };

    if (loading || news.length === 0) return null;

    // Duplicate list for seamless scrolling
    const tickerItems = [...news, ...news];

    return (
        <Paper
            elevation={0}
            sx={{
                height: 32,
                bgcolor: "background.darker",
                borderTop: `1px solid ${theme.palette.divider}`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    animation: `ticker ${news.length * 10}s linear infinite`,
                    '@keyframes ticker': {
                        '0%': { transform: 'translateX(-50%)' },
                        '100%': { transform: 'translateX(0)' }
                    },
                    '&:hover': {
                        animationPlayState: 'paused'
                    }
                }}
            >
                {tickerItems.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 3,
                            gap: 1.5
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '0.65rem',
                                color: 'primary.main',
                                fontWeight: 800,
                                opacity: 0.8
                            }}
                        >
                            {formatDate(item.pubDate)}
                        </Typography>

                        <Typography
                            variant="caption"
                            component={Link}
                            href={item.link}
                            target="_blank"
                            underline="none"
                            sx={{
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                fontWeight: 600,
                                transition: 'color 0.2s',
                                '&:hover': { color: 'primary.main' }
                            }}
                        >
                            {item.title}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '0.65rem',
                                color: 'text.disabled',
                                fontStyle: 'italic'
                            }}
                        >
                            ({item.source})
                        </Typography>

                        <DotIcon sx={{ fontSize: 6, color: alpha(theme.palette.divider, 0.5) }} />
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default NewsTicker;
