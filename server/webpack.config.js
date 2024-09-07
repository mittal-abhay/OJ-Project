import path from 'path';

export default {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.join(process.cwd(), 'dist'),
    publicPath: '/',
    filename: 'final.cjs',
  },
  target: 'node',
};
