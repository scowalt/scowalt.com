import { render, screen } from '@testing-library/react';
import type { ImgHTMLAttributes } from 'react';

import HomePage from '@/pages/index';

// Mock next/image since it's not available in the test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock the dynamic import of FancyLine
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    return function MockFancyLine({ buttonText }: { buttonText: string }) {
      return <div data-testid="fancy-line">{buttonText}</div>;
    };
  },
}));

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Scott Walters')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<HomePage />);
    expect(
      screen.getByText('Software Engineer from the Greater Chicago Area')
    ).toBeInTheDocument();
  });

  it('renders all social media links', () => {
    render(<HomePage />);
    
    // Check for all social media buttons
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Github')).toBeInTheDocument();
    expect(screen.getByText('Dev Blog')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders the avatar image', () => {
    render(<HomePage />);
    const avatar = screen.getByAltText('Scott Walters');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/images/me-2.png');
  });
}); 