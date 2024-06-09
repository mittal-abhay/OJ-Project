#include<bits/stdc++.h>
using namespace std;
int main(){
  vector<int> v(3);
  for(int i = 0; i < 3; i++){
    cin>>v[i];
  }
  reverse(v.begin(), v.end());
  for(int i = 0: i < 2; i++){
    cout<<i<<" "; 
  }
  cout<<v[2];
}