import numpy as np
import pandas as pd

def main():
    print("Hello from Dockerized project!")
    print("NumPy:", np.__version__)
    print("Pandas:", pd.__version__)

if __name__ == "__main__":
    main()