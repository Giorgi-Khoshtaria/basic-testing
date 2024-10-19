/* eslint-disable prettier/prettier */
import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

// Mock axios
jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const mockResponseData = { data: 'test data' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base URL', async () => {
    // Cast axios.create as a mock function
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponseData),
    });

    await throttledGetDataFromApi('/posts');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided URL', async () => {
    const axiosClient = {
      get: jest.fn().mockResolvedValue(mockResponseData),
    };

    (axios.create as jest.Mock).mockReturnValue(axiosClient);

    jest.useFakeTimers();

    throttledGetDataFromApi('/posts/1');

    jest.advanceTimersByTime(THROTTLE_TIME);

    throttledGetDataFromApi.flush();

    expect(axiosClient.get).toHaveBeenCalledWith('/posts/1');

    jest.useRealTimers();
  });

  test('should return response data', async () => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(mockResponseData),
    });

    jest.useFakeTimers();

    const dataPromise = throttledGetDataFromApi('/posts');

    jest.advanceTimersByTime(THROTTLE_TIME);

    throttledGetDataFromApi.flush();

    const data = await dataPromise;

    expect(data).toEqual(mockResponseData.data);

    jest.useRealTimers();
  });

  test('should throttle the API calls', async () => {
    jest.useFakeTimers();

    const axiosClient = {
      get: jest.fn().mockResolvedValue(mockResponseData),
    };

    (axios.create as jest.Mock).mockReturnValue(axiosClient);

    throttledGetDataFromApi('/posts');
    throttledGetDataFromApi('/posts');

    jest.advanceTimersByTime(THROTTLE_TIME);

    throttledGetDataFromApi.flush();

    expect(axiosClient.get).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
