import { render, screen } from '@testing-library/react';
import { AsyncWrapper } from '../AsyncWrapper';
import '@testing-library/jest-dom';

describe('AsyncWrapper', () => {
  it('shows loading spinner when loading', () => {
    render(
      <AsyncWrapper isLoading={true} error={null}>
        <div>Content</div>
      </AsyncWrapper>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Test error message';
    render(
      <AsyncWrapper isLoading={false} error={errorMessage}>
        <div>Content</div>
      </AsyncWrapper>
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows children when not loading and no error', () => {
    render(
      <AsyncWrapper isLoading={false} error={null}>
        <div>Test Content</div>
      </AsyncWrapper>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 