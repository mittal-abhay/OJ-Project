#include<bits/stdc++.h>
using namespace std;
int main(){
  int n;
  cin>>n;
  vector<int> v(n);
  for(int i = 0; i < n; i++){
    cin>>v[i];
  }
  reverse(v.begin(), v.end());
  for(int i = 0; i < n-1; i++){
    cout<<v[i]<<" ";
  }
  cout<<v[n-1]
}