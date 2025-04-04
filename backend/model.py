import torch
import torch.nn as nn
import torch.nn.functional as F

class CTTS(nn.Module):
    def __init__(self, input_dim, cnn_channels=64, num_heads=4, transformer_layers=2, hidden_dim=128, output_dim=1):
        super(CTTS, self).__init__()

        # CNN feature extractor
        self.conv1 = nn.Conv1d(in_channels=input_dim, out_channels=cnn_channels, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm1d(cnn_channels)
        self.conv2 = nn.Conv1d(in_channels=cnn_channels, out_channels=cnn_channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm1d(cnn_channels)
        self.pool = nn.MaxPool1d(kernel_size=2)

        # Transformer encoder
        encoder_layer = nn.TransformerEncoderLayer(d_model=cnn_channels, nhead=num_heads, dim_feedforward=hidden_dim)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=transformer_layers)

        # Fully connected output layer
        self.fc1 = nn.Linear(cnn_channels, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        # CNN feature extraction
        x = x.permute(0, 2, 1)  # Change shape for Conv1D (batch, features, sequence_length)
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.relu(self.bn2(self.conv2(x)))
        x = self.pool(x)

        # Transformer
        x = x.permute(2, 0, 1)  # Change shape for Transformer (sequence_length, batch, features)
        x = self.transformer(x)
        x = x.mean(dim=0)  # Aggregate features

        # Fully connected layers
        x = F.relu(self.fc1(x))
        x = self.fc2(x)

        return x