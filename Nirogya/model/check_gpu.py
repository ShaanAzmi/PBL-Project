"""Quick helper to check PyTorch + CUDA availability and device info.

Run: python check_gpu.py
"""
import sys

def main():
	try:
		import torch
	except Exception as e:
		print("PyTorch is not installed or failed to import:", e)
		sys.exit(1)

	print("PyTorch version:", torch.__version__)
	cuda_available = torch.cuda.is_available()
	print("CUDA available:", cuda_available)
	try:
		if cuda_available:
			print("CUDA device count:", torch.cuda.device_count())
			for i in range(torch.cuda.device_count()):
				name = torch.cuda.get_device_name(i)
				capability = torch.cuda.get_device_capability(i)
				print(f"Device {i}: {name} (capability: {capability})")
		else:
			print("No CUDA devices detected. Using CPU.")
	except Exception as e:
		print("Error while querying CUDA devices:", e)

if __name__ == '__main__':
	main()
