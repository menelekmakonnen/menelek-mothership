import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CameraApp from '../components/CameraApp';

const renderCamera = () => render(<CameraApp initialHud="standard" initialMode="photo" />);

describe('CameraApp flows', () => {
  it('opens the album and displays recent captures', async () => {
    renderCamera();
    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /open album/i }));
    });

    expect(screen.getByRole('dialog', { name: /recent captures/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('fires the flash and resets after the delay', async () => {
    jest.useFakeTimers();
    renderCamera();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /fire flash/i }));
    });
    expect(screen.getByText(/flash fired!/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(screen.getByText(/flash ready/i)).toBeInTheDocument();
    jest.useRealTimers();
  });
});
