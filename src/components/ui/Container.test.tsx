/**
 * Tests for Container component
 * Feature: 009-apple-hig-ui-redesign
 * Content deference through proper content width constraints
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(
        <Container>
          <div>Test Content</div>
        </Container>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render as a div by default', () => {
      const { container } = render(
        <Container>
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('DIV');
    });
  });

  describe('Size Variants', () => {
    it('should apply sm size class', () => {
      const { container } = render(
        <Container size="sm">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-sm');
      expect(containerElement).toHaveClass('max-w-3xl');
    });

    it('should apply md size class (default)', () => {
      const { container } = render(
        <Container size="md">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-md');
      expect(containerElement).toHaveClass('max-w-5xl');
    });

    it('should apply lg size class', () => {
      const { container } = render(
        <Container size="lg">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-lg');
      expect(containerElement).toHaveClass('max-w-7xl');
    });

    it('should apply full size class', () => {
      const { container } = render(
        <Container size="full">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-full');
      expect(containerElement).toHaveClass('max-w-full');
    });

    it('should use md size by default', () => {
      const { container } = render(
        <Container>
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-md');
    });
  });

  describe('Centering', () => {
    it('should center content by default', () => {
      const { container } = render(
        <Container>
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('mx-auto');
    });

    it('should not center when center is false', () => {
      const { container } = render(
        <Container center={false}>
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).not.toHaveClass('mx-auto');
    });
  });

  describe('Padding', () => {
    it('should apply default padding', () => {
      const { container } = render(
        <Container>
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('px-4');
    });

    it('should apply sm padding', () => {
      const { container } = render(
        <Container padding="sm">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('px-2');
    });

    it('should apply md padding', () => {
      const { container } = render(
        <Container padding="md">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('px-4');
    });

    it('should apply lg padding', () => {
      const { container } = render(
        <Container padding="lg">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('px-6');
    });

    it('should apply xl padding', () => {
      const { container } = render(
        <Container padding="xl">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('px-8');
    });

    it('should apply no padding when none', () => {
      const { container } = render(
        <Container padding="none">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('px-0');
    });
  });

  describe('Custom Element', () => {
    it('should render as section when as="section"', () => {
      const { container } = render(
        <Container as="section">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('SECTION');
    });

    it('should render as main when as="main"', () => {
      const { container } = render(
        <Container as="main">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('MAIN');
    });

    it('should render as article when as="article"', () => {
      const { container } = render(
        <Container as="article">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('ARTICLE');
    });

    it('should render as header when as="header"', () => {
      const { container } = render(
        <Container as="header">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('HEADER');
    });

    it('should render as footer when as="footer"', () => {
      const { container } = render(
        <Container as="footer">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('FOOTER');
    });
  });

  describe('Custom Classes', () => {
    it('should merge custom className with default classes', () => {
      const { container } = render(
        <Container className="custom-class">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('custom-class');
      expect(containerElement).toHaveClass('container-base');
    });

    it('should not override base classes', () => {
      const { container } = render(
        <Container className="my-custom-style">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('my-custom-style');
      expect(containerElement).toHaveClass('container-base');
      expect(containerElement).toHaveClass('mx-auto');
    });
  });

  describe('Combined Options', () => {
    it('should combine size, padding, and custom class', () => {
      const { container } = render(
        <Container size="lg" padding="lg" className="custom">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-lg');
      expect(containerElement).toHaveClass('max-w-7xl');
      expect(containerElement).toHaveClass('px-6');
      expect(containerElement).toHaveClass('custom');
    });

    it('should combine all options including center=false', () => {
      const { container } = render(
        <Container size="sm" padding="sm" center={false} className="test">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-sm');
      expect(containerElement).toHaveClass('px-2');
      expect(containerElement).not.toHaveClass('mx-auto');
      expect(containerElement).toHaveClass('test');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through id attribute', () => {
      const { container } = render(
        <Container id="test-id">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveAttribute('id', 'test-id');
    });

    it('should pass through data attributes', () => {
      const { container } = render(
        <Container data-testid="container" data-custom="value">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveAttribute('data-testid', 'container');
      expect(containerElement).toHaveAttribute('data-custom', 'value');
    });

    it('should pass through aria attributes', () => {
      const { container } = render(
        <Container aria-label="Main Container" aria-describedby="desc">
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveAttribute('aria-label', 'Main Container');
      expect(containerElement).toHaveAttribute('aria-describedby', 'desc');
    });
  });

  describe('Real-world Use Cases', () => {
    it('should work as page container', () => {
      const { container } = render(
        <Container as="main" size="lg" padding="lg">
          <h1>Page Title</h1>
          <p>Page content</p>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('MAIN');
      expect(containerElement).toHaveClass('max-w-7xl');
      expect(containerElement).toHaveClass('px-6');
      expect(screen.getByText('Page Title')).toBeInTheDocument();
    });

    it('should work as narrow content container', () => {
      const { container } = render(
        <Container size="sm" padding="md">
          <article>
            <p>Narrow content for better readability</p>
          </article>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('max-w-3xl');
      expect(containerElement).toHaveClass('px-4');
    });

    it('should work as full-width section', () => {
      const { container } = render(
        <Container as="section" size="full" padding="none">
          <div>Full width hero section</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement?.nodeName).toBe('SECTION');
      expect(containerElement).toHaveClass('max-w-full');
      expect(containerElement).toHaveClass('px-0');
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML with as prop', () => {
      const { container: mainContainer } = render(
        <Container as="main">
          <h1>Main Content</h1>
        </Container>
      );
      expect(mainContainer.querySelector('main')).toBeInTheDocument();

      const { container: sectionContainer } = render(
        <Container as="section">
          <h2>Section Content</h2>
        </Container>
      );
      expect(sectionContainer.querySelector('section')).toBeInTheDocument();
    });

    it('should support ARIA labels for navigation', () => {
      render(
        <Container as="nav" aria-label="Main Navigation">
          <ul>
            <li>Home</li>
          </ul>
        </Container>
      );
      const navElement = screen.getByLabelText('Main Navigation');
      expect(navElement).toBeInTheDocument();
      expect(navElement.nodeName).toBe('NAV');
    });
  });

  describe('Base Styles', () => {
    it('should always include container-base class', () => {
      const { container } = render(
        <Container>
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('container-base');
    });

    it('should include w-full class', () => {
      const { container } = render(
        <Container>
          <div>Test</div>
        </Container>
      );
      const containerElement = container.firstChild;
      expect(containerElement).toHaveClass('w-full');
    });
  });
});
